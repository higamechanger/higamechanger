# Preview & Testing Workflow

## How it works

- **`main`** = Live site (higamechanger.com) — do not merge until approved
- **`staging`** = Testing branch for previewing changes before pushing live

## Local staging preview

```bash
python3 -m http.server 3000 --bind 127.0.0.1
# http://127.0.0.1:3000/
```

## Launch pages (Updated Flow brief)

- `/` — Homepage
- `/approach` — The GameChanger System™
- `/reputation-strategy` — What is reputation strategy?
- `/executive-reputation-strategy` — Executive / CEO
- `/founders` — Founder reputation strategy
- `/masha-wheeler-bell` — Founder page
- `/review` — The GameChanger Review
- `/inquire` — Inquiry / conversion
- `/book` — Calendar booking (secondary)

## When ready to go live

```bash
git checkout main
git merge staging
git push origin main
```
