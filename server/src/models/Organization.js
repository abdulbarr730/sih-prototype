const mongoose = require('mongoose');

const OrganizationSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    website: { type: String, required: true }, // e.g., https://demo.edu
    allowedDomains: { type: [String], default: [] }, // e.g., ["demo.edu", "student.demo.edu"]
    announcementUrls: { type: [String], default: [] }, // pages to scrape
    scrapeEnabled: { type: Boolean, default: true },
    status: { type: String, enum: ['pending', 'active'], default: 'pending', index: true },
    slug: { type: String },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Organization', OrganizationSchema);

