const router = require('express').Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const Activity = require('../models/Activity');
const { requireAuth, requireRole } = require('../middleware/auth');

// Configure multer storage
const uploadsRoot = path.join(__dirname, '..', '..', 'uploads');
if (!fs.existsSync(uploadsRoot)) {
  fs.mkdirSync(uploadsRoot, { recursive: true });
}
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadsRoot);
  },
  filename: function (req, file, cb) {
    const unique = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    cb(null, `${unique}${ext}`);
  },
});
const upload = multer({ storage });

// Student creates an activity (with optional proof file)
router.post('/', requireAuth, upload.single('proof'), async (req, res) => {
  try {
    if (req.user.role !== 'student') return res.status(403).json({ message: 'Only students can upload activities' });
    if (!req.user.orgId) return res.status(400).json({ message: 'User is not assigned to an organization' });
    const { category, title, description, date } = req.body;
    if (!category || !title || !date) return res.status(400).json({ message: 'category, title, date are required' });

    const activity = await Activity.create({
      org: req.user.orgId,
      student: req.user.id,
      category,
      title,
      description,
      date: new Date(date),
      proofPath: req.file ? `/uploads/${req.file.filename}` : undefined,
      proofOriginalName: req.file ? req.file.originalname : undefined,
    });
    res.status(201).json(activity);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Student: list own activities
router.get('/mine', requireAuth, async (req, res) => {
  try {
    const activities = await Activity.find({ org: req.user.orgId, student: req.user.id }).sort({ createdAt: -1 });
    res.json(activities);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Faculty: list pending activities
router.get('/pending', requireAuth, requireRole('faculty'), async (req, res) => {
  try {
    const activities = await Activity.find({ org: req.user.orgId, status: 'pending' }).populate('student', 'name email');
    res.json(activities);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Faculty: approve
router.patch('/:id/approve', requireAuth, requireRole('faculty'), async (req, res) => {
  try {
    const activity = await Activity.findById(req.params.id);
    if (!activity) return res.status(404).json({ message: 'Activity not found' });
    if (String(activity.org) !== String(req.user.orgId)) return res.status(403).json({ message: 'Cross-org access denied' });
    if (activity.status !== 'pending') return res.status(400).json({ message: 'Already processed' });
    activity.status = 'approved';
    activity.approvedBy = req.user.id;
    activity.approvedAt = new Date();
    await activity.save();
    res.json(activity);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Faculty: reject
router.patch('/:id/reject', requireAuth, requireRole('faculty'), async (req, res) => {
  try {
    const { reason } = req.body;
    const activity = await Activity.findById(req.params.id);
    if (!activity) return res.status(404).json({ message: 'Activity not found' });
    if (String(activity.org) !== String(req.user.orgId)) return res.status(403).json({ message: 'Cross-org access denied' });
    if (activity.status !== 'pending') return res.status(400).json({ message: 'Already processed' });
    activity.status = 'rejected';
    activity.rejectionReason = reason || 'Not approved';
    activity.approvedBy = undefined;
    activity.approvedAt = undefined;
    await activity.save();
    res.json(activity);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;

