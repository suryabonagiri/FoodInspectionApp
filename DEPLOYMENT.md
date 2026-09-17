# Deploy FoodInspectionApp to Vercel

## GitHub import

1. Sign in at https://vercel.com using the GitHub account that owns `suryabonagiri/FoodInspectionApp`.
2. Choose **Add New → Project**, find **FoodInspectionApp**, and click **Import**.
3. Use these settings:
   - Framework preset: **Vite**
   - Root directory: repository root (`./`)
   - Build command: `npm run build`
   - Output directory: `dist`
   - Install command: `npm ci` (or Vercel's detected npm default)
4. For the current local-data version, leave Firebase environment variables unset. Click **Deploy**.
5. Open the generated `.vercel.app` URL. Check the directory, search, and a restaurant detail URL after refreshing the page.

`vercel.json` includes the SPA rewrite needed for direct visits to `/restaurant/...`, `/admin`, and `/submit`.

If the repository is already connected to a Vercel project, open that project's **Deployments** tab; a push to its production branch normally triggers deployment automatically. Confirm its Git settings point to this repository and its production branch is `main`.

## Current data behavior

The deployment includes 18 bundled restaurant records: 15 sourced historical records and three demo samples. The interface labels its local-data mode and source limitations. Admin edits are saved only in the visitor's browser, not shared with other visitors. Browser-saved additions from localhost do not transfer to the Vercel domain.

The local Admin/Admin gate is a prototype, not secure shared publishing. Firebase remains a separate phase: setting its environment variables switches the app to Firestore data, rather than displaying the bundled local catalogue. Configure administrator-only rules, authentication, and import data before enabling shared publishing; the current Firestore rule scaffold allows all authenticated users to write.

## Future updates

From the project folder, commit and push your changes to `main`:

```sh
git add .
git commit -m "Describe the update"
git push
```

Vercel's Git integration deploys production-branch pushes automatically. No GitHub Actions workflow is needed for this setup.

Official references:
- https://vercel.com/docs/git/vercel-for-github
- https://vercel.com/docs/frameworks/frontend/vite
