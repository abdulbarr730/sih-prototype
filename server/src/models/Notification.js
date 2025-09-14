const mongoose = require('mongoose');

const NotificationSchema = new mongoose.Schema(
  {
    org: { type: mongoose.Schema.Types.ObjectId, ref: 'Organization', required: true, index: true },
    title: { type: String, required: true },
    body: { type: String },
    category: {
      type: String,
      enum: ['conference','workshop','certification','club','volunteering','competition','leadership','internship','community-service','other','general'],
      default: 'general',
      index: true,
    },
    sourceUrl: { type: String },
    startsAt: { type: Date },
    endsAt: { type: Date },
    externalId: { type: String, index: true },
    status: { type: String, enum: ['pending','approved','rejected'], default: 'pending', index: true },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    approvedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    approvedAt: { type: Date },
    rejectionReason: { type: String },
    deletedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Notification', NotificationSchema);

