# Jobify — Frontend

A production-ready Job Portal frontend built with **React 18 + Vite**, **Bootstrap 5** (for base components) and **Tailwind CSS** (for utility styling), wired up to your Node/Express + MongoDB backend in `../backend`.

## Quick start

```bash
npm install
npm run dev
```

The app runs at `http://localhost:5173`.

## Connecting to your backend

All API calls go through a single axios instance at `src/api/axiosClient.js`, which reads its base URL from an environment variable — nothing else in the app hardcodes a URL.

1. Start your backend (see `../backend/README` / `npm run dev` in that folder, default port `5000`).
2. Edit `.env` in this folder:
   ```
   VITE_API_BASE_URL=http://localhost:5000
   ```
3. Restart `npm run dev` after changing `.env` (Vite only reads env files on startup).

If the backend is unreachable, or returns an empty/unexpected response, the `src/api/*` modules **fall back to realistic mock data** in `src/mocks/`, so the UI stays fully demoable. Look for `console.warn('[jobify] Falling back to mock data...')` in the browser console — that tells you a fallback happened.

## How the frontend maps to your backend

Your backend currently has two resources — `student` (auth/users) and `company` (job postings) — rather than a dedicated "Job" or "Employer" model. The frontend adapts to that:

| Frontend concept | Backend mapping |
|---|---|
| Job posting | A `company` document (`companyName`, `role`, `location`, `salaryPackage`) |
| Job Seeker | `student` document with `role: "student"` |
| Employer | `student` document with `role: "admin"` (reuses your existing `isAdmin` middleware) |
| Apply to a job | `POST /company/apply/:id` — also mirrored to `localStorage` so the seeker dashboard's status tracker (Applied/Interviewing/Offer/Rejected) works even though the backend doesn't track application status yet |
| Saved jobs, resume upload, notification prefs | Stored in `localStorage` — there's no backend endpoint for these yet |

Because the `company` schema doesn't (originally) store things like job type, experience level, description, or requirements, `src/api/jobs.js` fills those in with sensible defaults when reading from the backend so job cards always render fully. I extended `models/company.js` on the backend to actually persist `jobType`, `experience`, `category`, `description` and `requirements` — see the note below.

## Bug fixes I made in your backend while integrating

A few things in `backend/` would have silently broken the frontend, so I fixed them:

- **`companyRoute.js`**: `POST /company` ran the controller *before* the `verifyToken`/`isAdmin` middleware, so the auth check never actually happened. Reordered to `verifyToken → isAdmin → addCompany`.
- **`getAllCompanies`**: the success response was nested inside the "empty" `if` block, so a *successful* fetch with results returned nothing and the request would hang until timeout. Fixed to return properly in both cases.
- **`applyCompanies`**: had a typo (`comapny` instead of `company`), didn't import `Student`, read the id from the wrong param name, and never called `.save()` or sent a response. Rewritten to actually persist the application.
- **Models**: `{ timestamp: true }` isn't a real Mongoose option (it's `timestamps`), so `createdAt`/`updatedAt` were never being generated — fixed in both `student.js` and `company.js`. Also fixed `company.appliedStudents` to reference the `student` model instead of itself.
- **`company.js` model**: added `jobType`, `experience`, `category`, `description`, `requirements` fields so job postings created from the new "Post a Job" page persist properly instead of being dropped.

⚠️ One more thing worth flagging: your `backend/.env` has a **live MongoDB Atlas username and password** committed in the zip you shared. I didn't do anything with it, but you'll want to rotate that password and keep `.env` out of version control/zips going forward.

## Project structure

```
src/
  api/          axios instance + one file per resource (jobs, auth, applications, users)
  components/   reusable UI (Navbar, JobCard, FilterSidebar, Modal, Pagination, Toast...)
  context/      AuthContext, ThemeContext (dark/light), ToastContext
  hooks/        small reusable hooks (useDebounce)
  mocks/        fallback/demo data
  pages/        one file per route
  utils/        formatting helpers
  App.jsx       routes
  main.jsx      entry point
```

## Features included

- Landing page with hero search, stats banner, category tiles, featured jobs
- Job listings with filters (type, experience, category, salary), sorting, pagination, skeleton loaders
- Job details with company card, requirements, similar jobs, apply flow (with confirmation modal)
- Separate Job Seeker / Employer registration & login, with role-based redirect
- Job Seeker dashboard: profile summary, resume upload, saved jobs, applications with status tracker
- Employer dashboard: your postings + a kanban-style applicant pipeline (New → Shortlisted → Interview → Hired → Rejected)
- Post/Edit Job form with a live preview pane
- Public company profile page
- Profile & notification settings
- Dark/light theme toggle (Tailwind `class` strategy, persisted)
- Fully responsive, mobile nav + filter drawer
- Toast notifications for success/error/info

## Known gaps (by design, given the current backend)

- Application status (Interviewing/Offer/Rejected) and the applicant kanban pipeline are demo data / locally tracked — there's no backend model for these yet.
- Resume files aren't actually uploaded anywhere; the filename is stored locally so the UI flow works end-to-end.
- "Employer" is really `student.role === "admin"` under the hood, since the backend has no separate employer model.

These are natural next steps if you want to extend the backend — happy to help wire those up too.
