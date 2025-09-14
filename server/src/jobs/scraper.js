const cron = require('node-cron');
const axios = require('axios');
const cheerio = require('cheerio');
const Organization = require('../models/Organization');
const Notification = require('../models/Notification');
const User = require('../models/User');

function parseDateSafe(s) {
  if (!s) return undefined;
  const d = new Date(s);
  return isNaN(d.getTime()) ? undefined : d;
}

async function scrapeAnnouncementsForOrg(org) {
  if (!org) return { created: 0, skipped: 0 };
  const urls = Array.isArray(org.announcementUrls) ? org.announcementUrls : [];
  if (!urls.length) return { created: 0, skipped: 0 };

  // pick a creator: admin else faculty
  let creator = await User.findOne({ org: org._id, role: 'admin' }).select('_id');
  if (!creator) creator = await User.findOne({ org: org._id, role: 'faculty' }).select('_id');
  if (!creator) return { created: 0, skipped: 0 };

  let created = 0, skipped = 0;
  for (const u of urls) {
    try {
      const res = await axios.get(u);
      const $ = cheerio.load(res.data);
      $('.event').each(async (_, el) => {
        const externalId = $(el).attr('data-id') || $(el).find('a').attr('href');
        const title = $(el).attr('data-title') || $(el).find('.title').text().trim();
        const sourceUrl = $(el).attr('data-url') || $(el).find('a').attr('href');
        const category = $(el).attr('data-category') || 'general';
        const startsAt = parseDateSafe($(el).attr('data-date-start'));
        const endsAt = parseDateSafe($(el).attr('data-date-end'));
        const body = $(el).find('.body').text().trim() || undefined;
        if (!externalId || !title) return;

        const existing = await Notification.findOne({ org: org._id, externalId });
        if (existing) { skipped++; return; }

        await Notification.create({
          org: org._id,
          title,
          body,
          category,
          sourceUrl,
          startsAt,
          endsAt,
          externalId,
          status: 'pending',
          createdBy: creator._id,
        });
        created++;
      });
    } catch (e) {
      // ignore fetch errors for prototype
      continue;
    }
  }
  return { created, skipped };
}

async function runAll() {
  const orgs = await Organization.find({ scrapeEnabled: true }).lean();
  let summary = [];
  for (const org of orgs) {
    const res = await scrapeAnnouncementsForOrg(org);
    summary.push({ org: org.name, ...res });
  }
  return summary;
}

function start() {
  // every 15 minutes
  cron.schedule('*/15 * * * *', async () => {
    try {
      await runAll();
    } catch (e) {
      // swallow for prototype
    }
  });
}

module.exports = { start, runAll, scrapeAnnouncementsForOrg };

