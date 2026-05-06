# Host `Site_visualisations/r-matrix-animation` on GitHub Pages

## Context
- Repo: `KyberJeffHason/DataScienceExercises` (root contains course exercises + the Vite app subfolder)
- App: `Site_visualisations/r-matrix-animation/` — Vite 8 + React 19 + Tailwind 4
- Target URL: `https://kyberjeffhason.github.io/DataScienceExercises/`

## Plan

- [ ] 1. Fix Vite `base` so built asset URLs resolve under `/DataScienceExercises/`
  - Change `base: "/r-matrix-animation/"` → `base: "/DataScienceExercises/"` in `vite.config.js`
- [ ] 2. Fix the favicon link in `index.html`
  - Use a relative path (`./favicon.svg`) so it resolves regardless of base
- [ ] 3. Create GitHub Actions workflow `.github/workflows/deploy-pages.yml`
  - Triggers: push to `main` (only when the app folder or workflow changes), plus manual `workflow_dispatch`
  - Job 1 (build): checkout → setup-node 20 with npm cache → `npm ci` in app folder → `npm run build` → upload `dist/` as Pages artifact
  - Job 2 (deploy): `actions/deploy-pages@v4` with `pages: write` + `id-token: write` permissions and `github-pages` environment
- [ ] 4. Add a SPA-friendly `404.html` fallback (copy of `index.html` after build)
  - Not strictly needed since the app has no client-side router, but cheap insurance
- [ ] 5. Manual step for the user: enable Pages in repo Settings → Pages → Source = "GitHub Actions"
- [ ] 6. Commit & push, watch the Actions run, verify the live URL

## Review

### Files changed
- `Site_visualisations/r-matrix-animation/vite.config.js` — `base` now `/DataScienceExercises/` so built asset URLs match the project-page sub-path.
- `Site_visualisations/r-matrix-animation/index.html` — favicon link is relative (`./favicon.svg`) so it resolves regardless of base.
- `.github/workflows/deploy-pages.yml` (new) — official GitHub Pages workflow: builds the Vite app in the subfolder and deploys via `actions/deploy-pages@v4`. Triggers only when the app or workflow changes (plus manual dispatch). Caches npm and copies `index.html` → `404.html` for SPA-style fallbacks.

### Local verification
- `npm run build` succeeds in `Site_visualisations/r-matrix-animation/`.
- `dist/index.html` references `/DataScienceExercises/assets/…` — correct base.

### Manual user step (one-time)
1. Push the changes to `main`.
2. On GitHub: **Settings → Pages → Build and deployment → Source: GitHub Actions**.
3. The workflow will run automatically; once green, the site is live at:
   `https://kyberjeffhason.github.io/DataScienceExercises/`

### Future-proofing notes
- If you add more sub-apps under `Site_visualisations/`, you'll likely want a small landing page at the repo root and per-app sub-paths (e.g. `/DataScienceExercises/r-matrix-animation/`). At that point switch the workflow to assemble a multi-app `dist/` and update each sub-app's Vite `base` to its own sub-path.

