const mongoose = require('mongoose');

const ActivitySchema = new mongoose.Schema(
  {
    org: { type: mongoose.Schema.Types.ObjectId, ref: 'Organization', required: false, index: true },
    student: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    category: {
      type: String,
      enum: ['conference','workshop','certification','club','volunteering','competition','leadership','internship','community-service','other'],
      required: true,
      index: true,
    },
    title: { type: String, required: true },
    description: { type: String },
    date: { type: Date, required: true },
    proofPath: { type: String },
    proofOriginalName: { type: String },
    status: { type: String, enum: ['pending','approved','rejected'], default: 'pending', index: true },
    approvedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    approvedAt: { type: Date },
    rejectionReason: { type: String },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Activity', ActivitySchema);

