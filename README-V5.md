# Crosses & Clippers V5

V5 keeps the V4 visual language and adds:

- My Story media section using the supplied My Story photo + 4 supplied videos.
- Legends Barber Sponsorship section using only the supplied sponsorship photos + 5 supplied videos.
- Saint Mary's Children's Home section reserved exclusively for the Saint Mary's media you provide.
- Correct, unique video poster frames generated from the first frame of each supplied video.
- Client reviews with moderation.
- Owner login using Supabase Auth.
- Owner dashboard for reviews and client records.
- Existing V4 booking flow retained.
- Logo slot ready at `assets/logo.png`.
- Owner portrait slot currently uses the existing V4 owner/client image until the dedicated owner photo is supplied.

## Important backend setup

GitHub Pages can host the public site, but it should not store passwords or private client data. V5 therefore uses Supabase for authentication and database storage.

1. Create a Supabase project.
2. Run `supabase/schema.sql` in Supabase SQL Editor.
3. Create the owner's email/password account in Supabase Authentication > Users.
4. Put the project's URL and anon/public key into `supabase-config.js`.
5. Upload the V5 files and `assets/` folders to the GitHub Pages repository.
6. Do **not** put a Supabase service-role key in the website.

## Media folders

- `assets/my-story/` — only the supplied My Story media.
- `assets/sponsorship/` — only the supplied Legends Barber Sponsorship media.
- `assets/logo.png` — add the final logo here.
- Saint Mary's is intentionally empty until the supplied Saint Mary's images are added.

The original V4 assets (`client-cut.jpg`, `owner-client.jpg`, `owner-intro.mp4`, `precision-cut.mp4`, `signature-cut.mp4`) remain referenced by the new page and should stay in the existing `assets/` folder.
