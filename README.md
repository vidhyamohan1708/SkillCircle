# SkillCircle

Full-stack foundation for a student network focused on meaningful collaboration.

## Workspace

- `frontend/` - Next.js, React, TypeScript, Tailwind-ready web app and PWA shell.
- `backend/` - Separate Express + TypeScript API boundary.
- `backend/src/models/` - MongoDB/Mongoose user and post models.
- `backend/src/routes/` - Validated profile and post REST routes.
- `backend/src/middleware/` - Firebase bearer-token verification and ownership-aware auth.

## Run locally

```powershell
cd frontend
npm install
npm run dev
```

The landing page runs at `http://localhost:3000`.

```powershell
cd backend
npm install
npm run dev
```

The API health check runs at `http://localhost:4000/api/health`.

## Environment setup

Copy `frontend/.env.example` to `frontend/.env.local` and `backend/.env.example` to `backend/.env`.
The frontend Firebase settings are safe client-side settings. For signup, login profile checks, and all protected routes, replace the Firebase Admin values in `backend/.env` with values from Firebase Console > Project settings > Service accounts > Generate new private key. Keep the private key out of source control. The API can start without Admin credentials for health checks, but protected routes return `503` until they are configured.

## API slice

- `POST /api/users` - Create a profile using a verified Firebase bearer token.
- `GET /api/users/me` - Read the authenticated profile.
- `PATCH /api/users/me` - Update the authenticated profile.
- `GET /api/users/search?q=...` - Search profiles.
- `GET /api/posts?page=1&limit=20` - Read a paginated feed.
- `POST /api/posts` - Create an authenticated post.
- `POST /api/posts/:id/like` - Like or unlike a post.
- `DELETE /api/posts/:id` - Delete an owned post.

The remaining social, project, messaging, notification, image, and AI workflows should be added as separate vertical slices.
