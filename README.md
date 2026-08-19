# Mehdi Sadeghi — Academic Homepage

A clean, static academic personal website for [GitHub Pages](https://pages.github.com/). No build step, no backend—edit JSON files and push.

**Live site (after deploy):** https://mehdi-sadeghi.github.io

## Quick start

1. Replace placeholder text in [`data/site.json`](data/site.json).
2. Add your photo to `assets/img/` and update `profileImage` in `site.json`.
3. Add `files/cv.pdf` and set `"cv": "files/cv.pdf"` in `site.json`. Until then, the site shows “CV coming soon.”
4. Update lists in `data/publications.json`, `data/reports.json`, `data/software.json`, and `data/gallery.json`.
5. Push to GitHub; enable Pages (see [Deploy](#deploy-to-github-pages) below).

## Local preview

The site loads content with `fetch()`, which requires a local web server (opening `index.html` directly in the browser will not load JSON).

**Python:**

```bash
python -m http.server 8000
```

Then open http://localhost:8000

**Node (optional):**

```bash
npx serve
```

## Project structure

```
├── index.html              # Page layout (rarely needs edits)
├── data/
│   ├── site.json           # Name, bio, interests, contact, CV path
│   ├── publications.json   # Papers and articles
│   ├── reports.json        # Technical reports
│   ├── software.json       # Tools and repositories
│   └── gallery.json        # Image paths and captions
├── assets/
│   ├── css/main.css
│   ├── js/main.js
│   └── img/                # Profile photo and gallery images
├── files/
│   ├── cv.pdf              # Your CV (you add this)
│   └── papers/             # Optional PDFs for publications
├── .nojekyll               # Ensures GitHub Pages serves all files
└── README.md
```

## Editing content

### Profile, bio, contact (`data/site.json`)

| Field | Description |
|-------|-------------|
| `name` | Your full name |
| `title` | Role, e.g. "Ph.D. Candidate" |
| `affiliation` | University or lab |
| `tagline` | One-line summary under your name |
| `bio` | Array of paragraph strings |
| `researchInterests` | Array of interest labels |
| `profileImage` | Path to photo, e.g. `assets/img/profile.jpg` |
| `cv` | Path to PDF, e.g. `files/cv.pdf` |
| `contact` | `email`, `orcid`, `scholar`, `github`, `linkedin` |

Leave any contact URL empty (`""`) to hide it.

### Publications & reports (`data/publications.json`, `data/reports.json`)

Each file has an `items` array. Example entry:

```json
{
  "title": "Paper Title",
  "authors": "M. Sadeghi and A. Colleague",
  "venue": "Journal Name",
  "year": 2025,
  "abstract": "Optional short abstract.",
  "links": {
    "pdf": "files/papers/my-paper.pdf",
    "doi": "https://doi.org/10.0000/...",
    "code": "https://github.com/...",
    "project": "https://..."
  }
}
```

Omit or leave empty any `links` key you do not need. Buttons appear only for non-empty links.

### Software (`data/software.json`)

```json
{
  "name": "Tool Name",
  "description": "What it does.",
  "tags": ["Python", "CLI"],
  "links": {
    "repo": "https://github.com/...",
    "demo": "",
    "docs": "",
    "download": ""
  }
}
```

### Gallery (`data/gallery.json`)

Add images under `assets/img/gallery/` (JPG, PNG, or WebP), then reference them:

```json
{
  "images": [
    {
      "src": "assets/img/gallery/lab-photo.jpg",
      "alt": "Description for screen readers",
      "caption": "Optional caption shown below the image."
    }
  ]
}
```

## Deploy to GitHub Pages

1. Push this repository to `github.com/mehdi-sadeghi/mehdi-sadeghi.github.io` on the `main` branch.
2. On GitHub: **Settings → Pages**.
3. **Source:** Deploy from branch → `main` → `/ (root)` → Save.
4. After a minute or two, the site is live at https://mehdi-sadeghi.github.io

No GitHub Actions or Jekyll configuration is required. The `.nojekyll` file tells GitHub Pages not to run Jekyll (so `data/` and other paths are served as-is).

## Adding a new publication (checklist)

1. Copy an existing object in `data/publications.json` and edit the fields.
2. Optional: add the PDF to `files/papers/` and set `"pdf": "files/papers/your-file.pdf"`.
3. Commit and push. Changes appear after GitHub Pages rebuilds (usually within a minute).

## Customization tips

- **Colors and fonts:** edit CSS variables at the top of [`assets/css/main.css`](assets/css/main.css).
- **Navigation labels:** edit the `<nav>` list in [`index.html`](index.html).
- **Section order:** reorder `<section>` blocks in `index.html` (keep matching `id` attributes for nav links).

## Troubleshooting

| Problem | Solution |
|---------|----------|
| Blank sections locally | Use `python -m http.server`, not `file://` |
| JSON not updating on site | Hard-refresh browser; confirm push to `main` |
| CV shows “coming soon” | Add `files/cv.pdf` and update `site.json` |
| 404 on `data/*.json` | Ensure `.nojekyll` exists in the repo root |

## License

Content and code in this repository are yours to use and modify for your personal academic site.
