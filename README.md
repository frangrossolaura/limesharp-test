limesharp-test

A project showcase with a portfolio-style UI: fixed hero, card grid, and a detail view with transitions (including a “flip” animation between list and detail). Data is loaded from a mocked API in development and preview.

Tech stack





Vue 3 (Composition API, <script setup>)



Vite 8



JavaScript (ES modules)

Features





Two-column layout (hero + content) with a responsive structure



Project grid with selection and a detail view



Vite middleware exposing GET /api/projects with sample JSON (same behavior under vite preview)



Static build ready for any static file host

Requirements





Node.js 18+ (LTS recommended)

Local setup

# Clone (replace with your repository URL)
git clone <REPOSITORY_URL>
cd limesharp-test

# Install dependencies
npm install

# Dev server (hot reload)
npm run dev

Open the URL printed in the terminal (by default this is usually http://localhost:5173).

Scripts







Script



Description





npm run dev



Start Vite in development mode





npm run build



Production build output to dist/





npm run preview



Serve dist/ locally (useful to verify the build)

Project structure (overview)

limesharp-test/
├── src/
│   ├── api/           # Fetch client for /api/projects
│   ├── components/    # AppHeader, ProjectGrid, ProjectCard, ProjectDetail
│   ├── data/          # DTOs and project asset paths
│   ├── utils/         # Hero / flip animation logic
│   ├── assets/        # Images
│   ├── App.vue
│   └── main.js
├── vite.config.js     # Vue plugin + mock /api/projects middleware
└── package.json

Mock API

In development and vite preview, GET /api/projects returns the list defined in src/data/projects.dto.js.

Deployment





Run npm run build.



Upload the contents of dist/ to your provider (Netlify, Vercel, Cloudflare Pages, S3, etc.).



If required by your host, configure SPA fallback so unknown routes serve index.html.



Note: The /api/projects endpoint is provided by the Vite dev/preview server only. For a purely static production deploy you will need a real backend, a proxy, or another way to supply data (e.g. bundling it into the build), depending on your approach.

License

Private — see package.json ("private": true).
