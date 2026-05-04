# AI Education Capacity Web Story

Interactive web-style slide story for the AI Education Implementation Capacity project.

## Live Site

GitHub Pages URL after deployment:

https://kenny-choww.github.io/HKU-POLI3148-Group/

## Run Locally

```powershell
cd C:\Users\USER\Desktop\poli_gp\ai_web_story
python scripts/preprocess_data.py
node ..\.tooling\npm\bin\npm-cli.js install
node ..\.tooling\npm\bin\npm-cli.js run dev -- --port 5173
```

If regular `npm` is available on your machine, you can replace the `node ..\.tooling...` commands with:

```powershell
npm install
npm run dev -- --port 5173
```

## Build

```powershell
npm run build
npm run preview -- --port 4173
```

## Deploy

Pushes to `main` deploy automatically through GitHub Actions using `.github/workflows/deploy.yml`.

## Data

The story reads normalized JSON files from `public/data`. They are generated from the project CSVs and output tables by `scripts/preprocess_data.py`.
