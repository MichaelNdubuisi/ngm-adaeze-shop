# NGM Adaeze Monorepo Setup

This repository contains both the frontend and backend codebases for the NGM Adaeze project in a monorepo structure.

## Structure

- `/Frontend` - React frontend application
- `/new-ngm-backend` - Node.js backend application

## Deployment

### Vercel (Frontend)

- Configure the project to deploy from the `/Frontend` subdirectory.
- Set build command: `npm run build`
- Set output directory: `build`
- Set environment variables as needed.

### Render (Backend)

- Configure the project to deploy from the `/new-ngm-backend` subdirectory.
- Set build command: `npm install`
- Set start command: `npm start`
- Set environment variables as needed.

## Git Setup

To push this monorepo to GitHub:

```bash
git init
git add .
git commit -m "Initial commit of monorepo with frontend and backend"
git remote add origin <your-github-repo-url>
git push -u origin main
```

Replace `<your-github-repo-url>` with your actual GitHub repository URL.

## Notes

- Ensure environment variables are set correctly on both Vercel and Render.
- Update API URLs in frontend `src/api.js` to point to the deployed backend URL.
