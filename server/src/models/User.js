const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema(
  {
    org: { type: mongoose.Schema.Types.ObjectId, ref: 'Organization', index: true, required: false },
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true, index: true },
    passwordHash: { type: String, required: true },
    role: { type: String, enum: ['student', 'faculty', 'admin'], default: 'student', index: true },
    department: { type: String },
  },
  { timestamps: true }
);

module.exports = mongoose.model('User', UserSchema);

