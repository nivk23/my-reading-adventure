# My Reading Adventure — Dev Notes

## Run locally
```bash
npm install
npm run dev        # dev server at http://localhost:5173
```

## Build
```bash
npm run build      # production build → dist/
```

## Deploy to Firebase
```bash
npm run build
firebase deploy --only hosting --project mra-nivk23
```

Live URL: https://my-reading-adventure.web.app
Firebase console: https://console.firebase.google.com/project/mra-nivk23/overview

## Push to GitHub
```bash
git add .
git commit -m "your message"
git push
```

GitHub repo: https://github.com/nivk23/my-reading-adventure

## Full deploy (build + deploy + push)
```bash
npm run build
firebase deploy --only hosting --project mra-nivk23
git add .
git commit -m "your message"
git push
```
