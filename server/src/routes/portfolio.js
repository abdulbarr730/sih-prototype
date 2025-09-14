const router = require('express').Router();
const PDFDocument = require('pdfkit');
const dayjs = require('dayjs');
const User = require('../models/User');
const Activity = require('../models/Activity');
const { requireAuth } = require('../middleware/auth');

// Get approved activities JSON for a student
router.get('/:studentId', requireAuth, async (req, res) => {
  try {
    const { studentId } = req.params;
    if (req.user.role === 'student' && req.user.id !== studentId) {
      return res.status(403).json({ message: 'Students can only view their own portfolio' });
    }
    const student = await User.findById(studentId).select('name email role department org');
    if (!student) return res.status(404).json({ message: 'Student not found' });
    if (String(student.org) !== String(req.user.orgId)) return res.status(403).json({ message: 'Cross-org access denied' });
    const activities = await Activity.find({ org: req.user.orgId, student: studentId, status: 'approved' }).sort({ date: 1 });
    res.json({ student, activities });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Generate a very simple PDF portfolio
router.get('/:studentId/pdf', requireAuth, async (req, res) => {
  try {
    const { studentId } = req.params;
    if (req.user.role === 'student' && req.user.id !== studentId) {
      return res.status(403).json({ message: 'Students can only view their own portfolio' });
    }
    const student = await User.findById(studentId).select('name email department org');
    if (!student) return res.status(404).json({ message: 'Student not found' });
    if (String(student.org) !== String(req.user.orgId)) return res.status(403).json({ message: 'Cross-org access denied' });
    const activities = await Activity.find({ org: req.user.orgId, student: studentId, status: 'approved' }).sort({ date: 1 });

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=portfolio_${student._id}.pdf`);

    const doc = new PDFDocument({ margin: 50 });
    doc.pipe(res);

    doc.fontSize(20).text('Verified Student Portfolio', { align: 'center' });
    doc.moveDown(0.5);
    doc.fontSize(12).text(`Name: ${student.name}`);
    doc.text(`Email: ${student.email}`);
    if (student.department) doc.text(`Department: ${student.department}`);
    doc.moveDown();

    doc.fontSize(16).text('Approved Activities');
    doc.moveDown(0.25);
    if (activities.length === 0) {
      doc.fontSize(12).text('No approved activities yet.');
    } else {
      activities.forEach((a, idx) => {
        doc.fontSize(12).text(`${idx + 1}. [${a.category}] ${a.title}`);
        if (a.description) doc.text(`   ${a.description}`);
        if (a.date) doc.text(`   Date: ${dayjs(a.date).format('DD MMM YYYY')}`);
        if (a.proofPath) doc.text(`   Proof: ${a.proofPath}`);
        doc.moveDown(0.2);
      });
    }

    doc.end();
  } catch (err) {
    console.error(err);
    if (!res.headersSent) res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;

