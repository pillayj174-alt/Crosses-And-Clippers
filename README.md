# Crosses & Clippers V5 — final media/reviews/booking update

This package is a drop-in update for the existing GitHub Pages site.

## What changed
- Media is presented in a compact, professional interactive slideshow with arrows, dots, swipe support and slide counters.
- Video thumbnails use the first frame of each supplied video, avoiding duplicate-looking covers.
- The Legends Barber Sponsorship gallery contains the supplied sponsorship photos/videos only.
- My Story is cleaned up and no longer contains the old internal media-placeholder wording.
- My Story now includes the Alberton Record article story and a direct link to the article.
- My Story keeps the supplied full-story video as the main video.
- Booking creates one exact appointment message and uses that same text for WhatsApp and email.
- Bookings are also stored in the client/appointment database when Supabase is configured.
- Reviews have a professional star picker, public approved-review display, average rating, moderation and owner management.
- Owner dashboard includes Reviews, Clients and Appointments.
- Supabase is supported for real multi-device data/authentication; local browser storage remains as a fallback if Supabase is not configured.

## GitHub installation
Replace the existing `index.html`, `style.css`, and `app.js` with the files in this package. Copy the `assets` folder into the repository, and copy `supabase-config.js` into the repository root. Keep the `supabase/schema.sql` file for database setup.

## Supabase setup
1. Create a Supabase project.
2. Run `supabase/schema.sql` in the Supabase SQL Editor.
3. Create the owner account under Supabase Authentication > Users.
4. Put the project's public URL and anon key in `supabase-config.js`.
5. Do not put a service-role key in the website.

Without Supabase, the site still works locally in the browser, but owner/review/client data will not be shared between different devices.

## Article source
Alberton Record, 11 July 2025:
https://www.citizen.co.za/alberton-record/news-headlines/local-news/2025/07/11/businessman-sheldon-tatchell-lends-helping-hand-to-upcoming-barbershop-entrepreneur/
