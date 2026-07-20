# Preview & Testing Workflow

## How it works

- **`main`** = Live site (higamechanger.com)
- **`staging`** = Testing branch for previewing changes before pushing live

## Pages

- `index.html` — Home
- `review.html` — GameChanger Review (blog index)
- `article.html?a=<slug>` — Article template
- `book.html` — Book a Discovery Call

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
