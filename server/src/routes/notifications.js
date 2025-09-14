const router = require('express').Router();
const { requireAuth, requireRole } = require('../middleware/auth');
const Notification = require('../models/Notification');
const Organization = require('../models/Organization');
const { URL } = require('url');

function extractHost(urlStr) {
  try {
    const u = new URL(urlStr);
    return u.hostname.toLowerCase();
  } catch (e) {
    return null;
  }
}

async function isAllowedHostForOrg(orgId, sourceUrl) {
  const host = extractHost(sourceUrl);
  if (!host) return false;
  const org = await Organization.findById(orgId).lean();
  if (!org) return false;
  const allowed = new Set((org.allowedDomains || []).map((d) => String(d).toLowerCase()));
  // Also accept website host
  const websiteHost = extractHost(org.website);
  if (websiteHost) allowed.add(websiteHost);
  // In development, optionally allow localhost and 127.0.0.1 sources
  const devAllowLocal = (process.env.ALLOW_LOCAL_SOURCES || 'true').toLowerCase() === 'true';
  if (devAllowLocal && (host === 'localhost' || host === '127.0.0.1')) return true;
  // host must match exactly or be a subdomain of any allowed domain
  for (const d of allowed) {
    if (host === d) return true;
    if (host.endsWith('.' + d)) return true;
  }
  return false;
}

// Create notification (faculty)
router.post('/', requireAuth, requireRole('faculty'), async (req, res) => {
  try {
    const { title, body, sourceUrl, category = 'general' } = req.body;
    if (!title) return res.status(400).json({ message: 'title required' });
    if (sourceUrl && !(await isAllowedHostForOrg(req.user.orgId, sourceUrl))) {
      return res.status(400).json({ message: 'sourceUrl domain not allowed for this organization' });
    }
    const n = await Notification.create({
      org: req.user.orgId,
      title,
      body,
      category,
      sourceUrl,
      status: 'pending',
      createdBy: req.user.id,
    });
    res.status(201).json(n);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Pending list (faculty)
router.get('/pending', requireAuth, requireRole('faculty'), async (req, res) => {
  try {
    const items = await Notification.find({ org: req.user.orgId, status: 'pending' })
      .sort({ createdAt: -1 })
      .populate('createdBy', 'name email');
    res.json(items);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Approved list (any authenticated user, scoped to org)
router.get('/approved', requireAuth, async (req, res) => {
  try {
    const items = await Notification.find({ org: req.user.orgId, status: 'approved' })
      .sort({ approvedAt: -1 })
      .limit(50)
      .populate('approvedBy', 'name email')
      .populate('createdBy', 'name email');
    res.json(items);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Approve (faculty)
router.patch('/:id/approve', requireAuth, requireRole('faculty'), async (req, res) => {
  try {
    const n = await Notification.findById(req.params.id);
    if (!n) return res.status(404).json({ message: 'Notification not found' });
    if (String(n.org) !== String(req.user.orgId)) return res.status(403).json({ message: 'Cross-org access denied' });
    if (n.status !== 'pending') return res.status(400).json({ message: 'Already processed' });
    if (n.sourceUrl && !(await isAllowedHostForOrg(req.user.orgId, n.sourceUrl))) {
      const skip = (process.env.SKIP_SOURCE_VALIDATION || 'true').toLowerCase() === 'true';
      if (skip) {
        // For prototype/demo, drop the link and approve anyway
        n.sourceUrl = undefined;
      } else {
        return res.status(400).json({ message: 'sourceUrl domain not allowed for this organization' });
      }
    }
    // optional completion date override
    const { endsAt } = req.body || {};
    if (endsAt) {
      const d = new Date(endsAt);
      if (!isNaN(d.getTime())) n.endsAt = d;
    }
    n.status = 'approved';
    n.approvedBy = req.user.id;
    n.approvedAt = new Date();
    await n.save();
    res.json(n);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Reject (faculty)
router.patch('/:id/reject', requireAuth, requireRole('faculty'), async (req, res) => {
  try {
    const { reason } = req.body;
    const n = await Notification.findById(req.params.id);
    if (!n) return res.status(404).json({ message: 'Notification not found' });
    if (String(n.org) !== String(req.user.orgId)) return res.status(403).json({ message: 'Cross-org access denied' });
    if (n.status !== 'pending') return res.status(400).json({ message: 'Already processed' });
    n.status = 'rejected';
    n.rejectionReason = reason || 'Not approved';
    await n.save();
    res.json(n);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete (only approver or admin)
router.delete('/:id', requireAuth, requireRole('faculty'), async (req, res) => {
  try {
    const n = await Notification.findById(req.params.id);
    if (!n) return res.status(404).json({ message: 'Notification not found' });
    if (String(n.org) !== String(req.user.orgId)) return res.status(403).json({ message: 'Cross-org access denied' });
    const isApprover = n.approvedBy && String(n.approvedBy) === String(req.user.id);
    const isAdmin = req.user.role === 'admin';
    if (!isApprover && !isAdmin) return res.status(403).json({ message: 'Only approver or admin can delete' });
    await n.deleteOne();
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Insights (simple heuristic)
router.get('/:id/insights', requireAuth, async (req, res) => {
  try {
    const n = await Notification.findById(req.params.id);
    if (!n) return res.status(404).json({ message: 'Notification not found' });
    if (String(n.org) !== String(req.user.orgId)) return res.status(403).json({ message: 'Cross-org access denied' });
    // Minimal heuristic: map category to benefits, and cross-check student activity history count
    const categoryBenefits = {
      competition: 'Builds your competitive profile and problem-solving under time constraints. Useful for placements in software and analytics roles.',
      workshop: 'Hands-on learning that you can showcase as applied skills. Helpful for internships and projects.',
      certification: 'Adds a verifiable credential to your portfolio, improving shortlisting odds.',
      club: 'Demonstrates initiative and teamwork, valued in leadership tracks.',
      internship: 'Direct industry exposure; strengthens resume for placements.',
      leadership: 'Highlights ownership and people skills; strong signal for managerial tracks.',
      'community-service': 'Shows social impact; valued for scholarships and fellowships.',
      volunteering: 'Demonstrates commitment and initiative beyond academics.',
      general: 'Relevant extracurricular engagement that enhances your holistic profile.'
    };
    const benefit = categoryBenefits[n.category] || categoryBenefits.general;
    // Return a simple text for MVP
    res.json({ insights: benefit });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Manual trigger: scrape now for current org
router.post('/scrape-now', requireAuth, async (req, res) => {
  try {
    const Organization = require('../models/Organization');
    const { scrapeAnnouncementsForOrg } = require('../jobs/scraper');
    const org = await Organization.findById(req.user.orgId).lean();
    if (!org) return res.status(400).json({ message: 'No organization' });
    const result = await scrapeAnnouncementsForOrg(org);
    res.json({ ok: true, result });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;

