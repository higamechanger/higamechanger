# Preview & Testing Workflow

## How it works

- **`main`** = Live site (higamechanger.com)
- **`staging`** = Testing branch for previewing changes before pushing live

## Workflow

1. **Make changes on staging** – All edits happen on the `staging` branch
2. **Preview locally** – Run `npm run preview` and open http://localhost:3000
3. **Push live when ready** – Merge `staging` into `main` and push

## Commands

```bash
# Preview your changes locally (from project root)
npm run preview

# When ready to go live: merge staging into main and push
git checkout main
git merge staging
git push origin main
```

## Current branch

You're on `staging` – make your updates here and preview before merging to `main`.
