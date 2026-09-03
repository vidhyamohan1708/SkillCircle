# SkillCircle

Full-stack foundation for a student network focused on meaningful collaboration.

## Workspace

- `frontend/` - Static HTML, CSS, and vanilla JavaScript PWA shell.
- `backend/` - Separate Express + TypeScript API boundary.
- `backend/src/models/` - MongoDB/Mongoose user and post models.
- `backend/src/routes/` - Validated profile and post REST routes.
- `backend/src/middleware/` - Firebase bearer-token verification and ownership-aware auth.

## Run locally

```powershell
npm install
npm run dev
```

The app and API run together at `http://localhost:4000`.

## Environment setup

Copy `.env.example` to `.env` and fill in the MongoDB, Firebase Admin, Cloudinary, and Groq credentials. The browser-safe Firebase settings are served by the backend config endpoint; no second frontend env file is needed.

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
