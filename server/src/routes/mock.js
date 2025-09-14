const router = require('express').Router();

// Very simple mock announcements page for demo scraping
// Each .event article includes data-* attributes the scraper reads
router.get('/demo.edu/events', (req, res) => {
  res.setHeader('Content-Type', 'text/html');
  res.send(`
<!doctype html>
<html><head><title>Demo University Events</title></head>
<body>
  <article class="event" data-id="hackathon-2025" data-title="Inter-College Hackathon 2025" data-category="competition" data-date-start="2025-09-20" data-date-end="2025-09-22" data-url="localhost:5000/demo.edu/events/hackathon-2025">
    <div class="title">Inter-College Hackathon 2025</div>
    <div class="body">48-hour hackathon. Teams of 3-5. Prizes and internships offered.</div>
  </article>
  <article class="event" data-id="ai-workshop" data-title="AI Workshop" data-category="workshop" data-date-start="2025-10-05" data-date-end="2025-10-05" data-url="localhost:5000/demo.edu/events/ai-workshop">
    <div class="title">AI Workshop</div>
    <div class="body">Hands-on session on ML model deployment.</div>
  </article>
</body></html>
  `);
});

module.exports = router;

