# Tabiat Gran — Single Vercel Deployment

This repository is now one Next.js application.

## URLs after deployment

- `/` — public website
- `/admin` — CMS dashboard
- `/login` — CMS login
- `/change-password` — forced password-change flow
- `/api/public/*` — public website APIs
- `/api/admin/*` — authenticated CMS APIs

No separate frontend/backend Vercel projects are required and no `VITE_CMS_API_URL` is used.

## Vercel setup

1. Import this repository as one Vercel project.
2. Root Directory: repository root (`.`).
3. Framework Preset: Next.js (auto-detected).
4. Build Command: `next build` / default.
5. Add the runtime environment variables from `.env.example`:
   - `MONGODB_URI`
   - `AUTH_SECRET`
   - `CLOUDINARY_CLOUD_NAME`
   - `CLOUDINARY_API_KEY`
   - `CLOUDINARY_API_SECRET`
6. Deploy.

For a normal single-domain deployment, `PUBLIC_WEB_ORIGIN` is not required.

## First administrator

Pull the production environment variables locally, then run:

```bash
npm install
npm run create-admin -- --email admin@example.com --password "StrongPassword123!" --name "Administrator"
```

## Seed the existing public-site content

```bash
npm run seed
```

If you do not want the seed script to copy legacy remote images to Cloudinary, set:

```env
MIGRATE_LEGACY_MEDIA=false
```
