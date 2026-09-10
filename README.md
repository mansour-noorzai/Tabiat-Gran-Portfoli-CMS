# Tabiat Gran Web + CMS

A single full-stack Next.js application containing the public Tabiat Gran website, CMS/admin panel, API routes, MongoDB persistence and Cloudinary media management.

**Live website:** [https://tabiatgran.vercel.app](https://tabiatgran.vercel.app)

## Application routes

| Route | Purpose |
| --- | --- |
| `/` | Public website |
| `/admin` | CMS dashboard |
| `/login` | CMS login |
| `/change-password` | Required password-change flow |
| `/api/public/*` | Public website data/contact APIs |
| `/api/admin/*` | Protected CMS APIs |
| `/api/auth/*` | Authentication/profile APIs |
| `/api/health` | Production readiness check for the database and authentication configuration |

The public website and CMS use separate Next.js root layouts so their visual systems remain isolated even though they are deployed from one application.

## Local setup

```bash
npm install
cp .env.example .env.local
npm run dev
```

Open:

- Public site: `http://localhost:3000/`
- CMS: `http://localhost:3000/admin`
- Login: `http://localhost:3000/login`

## Required environment variables

```env
MONGODB_URI=mongodb+srv://USERNAME:PASSWORD@CLUSTER.mongodb.net/tabiat_gran_cms?retryWrites=true&w=majority
AUTH_SECRET=replace-with-at-least-32-random-characters
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
```

`PUBLIC_WEB_ORIGIN` is not required for the normal single-domain deployment.

## Create the first administrator

```bash
npm run create-admin -- --email admin@example.com --password "StrongPassword123!" --name "Administrator"
```

## Seed existing website content

```bash
npm run seed
```

Set `MIGRATE_LEGACY_MEDIA=false` before seeding if existing remote images should not be copied into Cloudinary.

## Vercel

Deploy the repository root as one Next.js project. Add the required environment variables in Vercel Project Settings, then deploy. No separate frontend deployment, backend deployment, redirect, or `VITE_CMS_API_URL` is required.

See `DEPLOYMENT.md` for the deployment checklist.
