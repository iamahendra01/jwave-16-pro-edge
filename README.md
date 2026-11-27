# J-Wave 16 Pro Edge — Website (ready to deploy)

## How to run / deploy
No build step. Unzip and open `index.html`, or upload the whole folder to any static host (cPanel, Netlify, GitHub Pages).
Files: `index.html, scalping-course.html, weekly-nifty-levels.html, about.html, contact.html, css/style.css, js/main.js, images/`.
Nothing is left to fill in; there are no placeholders.

## Enroll and payment flow
- "Enroll Now" opens a form (email, name, phone, age, city). On submit, all details open in WhatsApp (9872106782) as a prefilled message.
- "Pay via QR" shows the payment QR only on click (hidden otherwise). After paying, "Share Payment Screenshot on WhatsApp" opens WhatsApp so the student can attach the screenshot.

## Common edits
- WhatsApp number: top of `js/main.js` (`WHATSAPP_NUMBER`). Also search the HTML for `919872106782` / `9872106782` (links, footer, course page text).
- Course fee, name or text: `scalping-course.html` (and the home course card). Fee is also in the `data-price` of the Enroll Now / Pay via QR buttons.
- Payment QR: replace `images/payment-qr.png` with a new image of the same name.
- Logo: `images/logo.png`; favicon files: `images/favicon.png`, `apple-touch-icon.png`, `favicon.ico`.
- Mentor photo: `images/mentor.jpg`. Background images: `images/bg-1.jpg` to `bg-5.jpg`.
- Add another course: copy one `<div class="card course-card">` block on the home page (or a course section) and change the name and price in its two buttons (`data-course`, `data-price`).

## Home page visual library
The infographics live in `images/` (five-pillars, trader-journey, why-trading, capital-protection-rules, strong-weak-breakout, candlestick-checklist, trading-plan, small-daily-steps, money-mindset, focus-on-skill, knowledge-banner). They are placed in `index.html`; tapping one opens it enlarged.
