require('dotenv').config();
const bcrypt = require('bcryptjs');
const connectDB = require('./config/db');
const User = require('./models/User');
const Organization = require('./models/Organization');
const Notification = require('./models/Notification');

async function run() {
  try {
    await connectDB();

    // Create or get demo organization (manually approved)
    const orgName = 'Demo University';
const orgWebsite = 'https://demo.edu';
    const allowedDomains = ['demo.edu','localhost','127.0.0.1'];
    let org = await Organization.findOne({ name: orgName });
    if (!org) {
      org = await Organization.create({ name: orgName, website: orgWebsite, allowedDomains, status: 'active', announcementUrls: ['http://localhost:5000/mock/demo.edu/events'], scrapeEnabled: true });
      console.log('Created organization:', org.name);
    } else {
      org.status = 'active';
      org.allowedDomains = allowedDomains;
      org.website = orgWebsite;
      org.announcementUrls = ['http://localhost:5000/mock/demo.edu/events'];
      org.scrapeEnabled = true;
      await org.save();
      console.log('Updated organization:', org.name);
    }

    const users = [
      { name: 'Student One', email: 'student1@example.com', role: 'student', password: 'Pass@123' },
      { name: 'Faculty One', email: 'faculty1@example.com', role: 'faculty', password: 'Pass@123' },
      { name: 'Faculty Two', email: 'faculty2@example.com', role: 'faculty', password: 'Pass@123' },
      { name: 'Org Admin', email: 'admin1@example.com', role: 'admin', password: 'Pass@123' },
    ];

    let facultyUser = null;

    for (const u of users) {
      let existing = await User.findOne({ email: u.email });
      if (existing) {
        // ensure org is set
        if (!existing.org) { existing.org = org._id; await existing.save(); }
        console.log(`User exists: ${u.email}`);
        if (u.role === 'faculty') facultyUser = existing;
        continue;
      }
      const passwordHash = await bcrypt.hash(u.password, 10);
      const created = await User.create({ name: u.name, email: u.email, role: u.role, passwordHash, org: org._id });
      console.log(`Created ${u.role}: ${u.email} (password: ${u.password})`);
      if (u.role === 'faculty') facultyUser = created;
    }

    // Seed a sample pending notification by faculty
    if (facultyUser) {
      const existingSample = await Notification.findOne({ org: org._id, title: 'Inter-College Hackathon' });
      if (!existingSample) {
        await Notification.create({
          org: org._id,
          title: 'Inter-College Hackathon',
          body: '48-hour hackathon this weekend. Form teams of 3-5. Prizes and internships on offer.',
          category: 'competition',
          sourceUrl: 'localhost:5000/demo.edu/events/hackathon',
          status: 'pending',
          createdBy: facultyUser._id,
        });
        console.log('Seeded sample notification: Inter-College Hackathon');
      }
    }

    console.log('Seeding complete');
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

run();

