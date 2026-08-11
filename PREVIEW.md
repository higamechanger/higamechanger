# Preview & Testing Workflow

## How it works

- **`main`** = Live site (higamechanger.com)
- **`staging`** = Testing branch for previewing changes before pushing live

## Pages (v1 launch)

- `index.html` — Home
- `book.html` — Book a Discovery Call

## Parked for later

The Review / journal is parked in `_parked/review/` (see that folder’s README to restore).

Root `review.html` and `article.html` currently redirect to the homepage.

## Commands

```bash
# Preview your changes locally (from project root)
npm run preview
# or
python3 -m http.server 3000 --bind 127.0.0.1

# When ready to go live: merge staging into main and push
git checkout main
git merge staging
git push origin main
```

## Current branch

You're on `staging` – make your updates here and preview before merging to `main`.
