const router = require('express').Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Organization = require('../models/Organization');
const { requireAuth } = require('../middleware/auth');

async function resolveDefaultOrgId() {
  const active = await Organization.find({ status: 'active' }).select('_id').lean();
  if (active.length === 1) return active[0]._id;
  return null;
}

// Register (MVP: student-only via API; faculty/admin via seed). If a single active org exists, auto-assign.
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, orgId } = req.body;
    if (!name || !email || !password) return res.status(400).json({ message: 'name, email, password required' });
    const existing = await User.findOne({ email: email.toLowerCase() });
    if (existing) return res.status(409).json({ message: 'Email already registered' });
    const passwordHash = await bcrypt.hash(password, 10);

    let org = orgId;
    if (!org) {
      org = await resolveDefaultOrgId();
      if (!org) return res.status(400).json({ message: 'orgId required (no default organization set)' });
    }

    const user = await User.create({ name, email: email.toLowerCase(), passwordHash, role: 'student', org });
    return res.status(201).json({ id: user._id, name: user.name, email: user.email, role: user.role, org: user.org });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ message: 'email and password required' });
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) return res.status(401).json({ message: 'Invalid credentials' });
    const ok = await bcrypt.compare(password, user.passwordHash);
    if (!ok) return res.status(401).json({ message: 'Invalid credentials' });

    const token = jwt.sign({ id: user._id, name: user.name, email: user.email, role: user.role, orgId: user.org }, process.env.JWT_SECRET, { expiresIn: '7d' });
    return res.json({ token, user: { id: user._id, name: user.name, email: user.email, role: user.role, orgId: user.org } });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

router.get('/me', requireAuth, async (req, res) => {
  const user = await User.findById(req.user.id).select('name email role department org').populate('org','name website status');
  res.json({ user });
});

module.exports = router;

