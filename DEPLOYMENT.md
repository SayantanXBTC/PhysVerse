# PhysVerse — Deployment Guide

Fresh-deploy playbook. Order matters: **Database → Backend → Frontend**.

---

## 1. Railway MongoDB (database)

Railway is used instead of Atlas — no auto-pause after inactivity, painless setup.

1. Sign up at https://railway.app (GitHub login)
2. **New Project** → **Deploy MongoDB** (template)
3. Wait ~30s for provisioning
4. Click the MongoDB service → **Variables** tab
5. Copy the `MONGO_URL` value. Looks like:
   ```
   mongodb://mongo:PASSWORD@monorail.proxy.rlwy.net:12345
   ```
6. **Append database name** (`/physverse`) before any `?`:
   ```
   mongodb://mongo:PASSWORD@monorail.proxy.rlwy.net:12345/physverse
   ```

Save this URI — paste into Render + local `backend/.env`.

> **Free tier:** $5/mo credit (~500 hrs of a tiny Mongo instance). No auto-pause. If credit runs out, service pauses until next month cycle. Upgrade to Hobby ($5 actual) for always-on production.

> **Networking:** Railway exposes MongoDB via a public TCP proxy — no IP allowlist needed. Render can connect directly.

---

## 2. Google OAuth (optional but recommended)

1. https://console.cloud.google.com → new project `PhysVerse`
2. APIs & Services → **OAuth consent screen**
   - User type: External
   - App name: PhysVerse
   - Support email: yours
   - Add test users (yourself) while in Testing mode
3. Credentials → Create Credentials → **OAuth Client ID**
   - Type: **Web application**
   - Authorized JavaScript origins:
     - `http://localhost:5173`
     - `https://<your-netlify-site>.netlify.app`
   - No redirect URI needed (using Google Identity Services credential flow)
4. Copy **Client ID** — set as `GOOGLE_CLIENT_ID` (backend) and `VITE_GOOGLE_CLIENT_ID` (frontend).

---

## 3. Backend — Render

1. https://dashboard.render.com → New → **Web Service**
2. Connect GitHub repo → `PhysVerse`
3. Configure:
   - **Root directory**: `backend`
   - **Build command**: `npm install && npm run build`
   - **Start command**: `npm start`
   - **Instance type**: Free
   - **Health check path**: `/api/health`
4. **Environment** (add as secrets):

   | Key | Value |
   |-----|-------|
   | `NODE_ENV` | `production` |
   | `MONGODB_URI` | (Railway URI from step 1) |
   | `JWT_SECRET` | `openssl rand -base64 32` output |
   | `FRONTEND_URL` | `https://<your-netlify>.netlify.app` (set after step 4) |
   | `ALLOWED_ORIGINS` | same as `FRONTEND_URL`, comma-separated if multiple |
   | `GOOGLE_CLIENT_ID` | (from step 2) |
   | `EMAIL_PROVIDER` | `resend` or `sendgrid` (empty = no-op) |
   | `RESEND_API_KEY` | if using Resend |
   | `EMAIL_FROM` | `PhysVerse <noreply@yourdomain.com>` |

   Do **not** set `PORT` — Render injects it.

5. Deploy. Watch logs for `🚀 Server running on port ...`
6. Test: `curl https://<service>.onrender.com/api/health` → `{"status":"ok",...}`

Copy the service URL — paste into Netlify next.

> Free tier spins down after 15 min idle. First request after sleep = 30-60s cold start. `warmBackend()` in `frontend/src/main.tsx` pre-warms on page load.

---

## 4. Frontend — Netlify

1. https://app.netlify.com → Add new site → Import from Git
2. Pick repo → configure:
   - **Base directory**: `frontend`
   - **Build command**: `npm run build`
   - **Publish directory**: `frontend/dist`
3. **Environment variables**:

   | Key | Value |
   |-----|-------|
   | `VITE_API_URL` | `https://<render-service>.onrender.com/api` |
   | `VITE_GOOGLE_CLIENT_ID` | (from Google step 2) |

4. Deploy. Note the assigned URL (e.g., `https://physverse-xxxx.netlify.app`)
5. **Go back to Render** → set `FRONTEND_URL` + `ALLOWED_ORIGINS` to the Netlify URL. Redeploy backend.
6. **Go back to Google Cloud** → add Netlify URL to Authorized JavaScript origins.

---

## 5. Verify

- Visit Netlify URL → landing loads
- Signup with email + password → redirect to `/onboarding`
- Signup with Google → same flow
- Check Railway → MongoDB service → **Data** tab → `users` collection has your record
- Check Render logs → no errors

---

## Local development

```bash
# backend
cd backend
cp .env.example .env    # fill in MONGODB_URI, JWT_SECRET, GOOGLE_CLIENT_ID
npm install
npm run dev             # http://localhost:5001

# frontend (new terminal)
cd frontend
cp .env.example .env    # fill in VITE_GOOGLE_CLIENT_ID
npm install
npm run dev             # http://localhost:5173
```

Local frontend hits local backend via `VITE_API_URL=http://localhost:5001/api` (default).

---

## Troubleshooting

| Symptom | Cause | Fix |
|---------|-------|-----|
| Signup hangs, no toast | Backend cold-start (>30s) or dead | Wait, or check Render logs |
| `HTTP 503` from backend | Deploy crashed, likely bad `MONGODB_URI` | Check Render logs for `MongoServerError` |
| `CORS blocked origin` in browser console | `ALLOWED_ORIGINS` missing Netlify URL | Add to Render env, redeploy |
| Google button missing | `VITE_GOOGLE_CLIENT_ID` not set | Set in Netlify env, redeploy |
| `Google authentication not configured` toast | Backend missing `GOOGLE_CLIENT_ID` | Set in Render env, redeploy |
| `401 Invalid credentials` on Google login | Client ID mismatch between frontend + backend | Must be identical |
| Railway connection times out | Copied internal URI instead of public proxy URI | Use the `MONGO_URL` from Variables tab (contains `proxy.rlwy.net`), not `MONGO_PRIVATE_URL` |
| `MongoServerError: Authentication failed` | Password not URL-encoded, or wrong DB name | Copy raw `MONGO_URL` fresh from Railway, append `/physverse` before `?` |
| Emails not sending | `EMAIL_PROVIDER` empty | Set to `resend` + add API key |

---

## Rotating secrets

If any secret leaks (e.g., committed to Git):

1. **Railway MongoDB**: service → Variables → regenerate `MONGO_PASSWORD` → copy new `MONGO_URL` → update `MONGODB_URI` in Render + local `.env`
2. **JWT**: `openssl rand -base64 32` → update `JWT_SECRET` in Render (invalidates all sessions)
3. **Google Client ID** is public-safe (embedded in frontend). No secret exists in this OAuth flow.
4. **Resend/SendGrid**: rotate in their dashboards → update env in Render.

For full Git history scrub of a leaked secret: use `git filter-repo` or BFG Repo-Cleaner. Destructive — rewrites history.
