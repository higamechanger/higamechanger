# Parked: GameChanger Review (blog)

Parked for v1 launch so the live site ships without The Review / journal.

## What's here

| File | Purpose |
|------|---------|
| `review.html` | Full Review index page |
| `article.html` | Article template (`?a=<slug>`) |
| `homepage-journal-section.html` | Homepage journal preview block to paste back into `index.html` |

Related styles stay in `css/style.css` (journal / article sections). Article data + rendering stay in `js/script.js`. Article images stay in `images/assets/*-article.jpg`.

## Restore later

1. Move `review.html` and `article.html` back to the site root.
2. Paste `homepage-journal-section.html` into `index.html` (before the signature section).
3. Add nav link on the homepage: `<a class="nav-link" href="review.html">The Review</a>`
4. Remove the temporary root redirects for `review.html` / `article.html` if still present.
5. Bump CSS/JS cache query strings and preview.
