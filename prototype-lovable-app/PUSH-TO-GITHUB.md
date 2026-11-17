# Pushing this app to github.com/aamorifreeman/HousingSeniorProject

Lovable's Git sync can only attach to a repository it creates itself, so this
folder is the app's source, ready for you to push into your existing repo.
Your repo currently holds only `LICENSE` — nothing here overwrites it.

## 1. Put the app inside a clone of your repo

```sh
unzip HousingSeniorProject-src.zip
cd HousingSeniorProject-src
git clone https://github.com/aamorifreeman/HousingSeniorProject.git
rsync -a --exclude PUSH-TO-GITHUB.md --exclude HousingSeniorProject ./ HousingSeniorProject/
```

If `rsync` isn't available, copy the items by hand instead:
`.gitignore .prettierignore .prettierrc AGENTS.md README.md bun.lock bunfig.toml
components.json eslint.config.js package.json public src tsconfig.json
vite.config.ts vitest.config.ts` into the cloned folder.

## 2. Commit and push

```sh
cd HousingSeniorProject
git add -A
git commit -m "Add Homebase off-campus housing prototype"
git push
```

## 3. Run it locally

```sh
npm i
npm run dev
```

## What's still simulated

- Nothing is saved between visits: reviews, maintenance reports, landlord
  replies and roommate groups reset on reload. The six homes and six roommate
  profiles are made up.
- Match scores, review summaries and lease flagging follow fixed rules written
  in `src/lib/data.ts` — no AI service is called.
- Uploading a lease PDF loads the sample lease instead of reading your file.
- "Share" and "Export" buttons only show a confirmation; nothing is sent.
- The cost-trend and requirements charts on the admin page are invented numbers.

## If you want automatic commits later

Project settings → Git in Lovable connects the project to a repository, but it
creates a new private one — it cannot attach to `HousingSeniorProject`.
