# Deployment Guide

## Step 1: Set up Turso Database

1. Install Turso CLI:

   ```bash
   # Windows (PowerShell)
   irm get.tur.so/install.ps1 | iex

   # Or download from: https://docs.turso.tech/cli/installation
   ```

2. Sign up and create database:

   ```bash
   turso auth signup
   turso db create grocery-tracker
   ```

3. Get your database credentials:

   ```bash
   turso db show grocery-tracker --url
   turso db tokens create grocery-tracker
   ```

   Save these values - you'll need them!

4. Push your schema to Turso:

   ```bash
   # Create .env.local file with your Turso credentials
   echo "TURSO_DATABASE_URL=your-url-here" > .env.local
   echo "TURSO_AUTH_TOKEN=your-token-here" >> .env.local

   # Push schema
   npx drizzle-kit push
   ```

5. Seed the database:
   ```bash
   npm run db:seed
   ```

## Step 2: Deploy to Vercel

1. Push your code to GitHub:

   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   # Create a repo on GitHub, then:
   git remote add origin https://github.com/YOUR-USERNAME/grocery-tracker.git
   git push -u origin main
   ```

2. Deploy to Vercel:
   - Go to [vercel.com](https://vercel.com)
   - Sign up with GitHub
   - Click "New Project"
   - Import your `grocery-tracker` repository
   - Add environment variables:
     - `TURSO_DATABASE_URL`: (from step 3 above)
     - `TURSO_AUTH_TOKEN`: (from step 3 above)
   - Click "Deploy"

3. Done! Your app will be live at `https://your-app.vercel.app`

## Local Development

The app still works locally with the SQLite file:

```bash
npm run dev
```

## View Database

```bash
# Turso CLI
turso db shell grocery-tracker

# Or use Drizzle Studio
npm run db:studio
```

## Costs

- Turso Free Tier: 9 GB storage, 1 billion row reads/month
- Vercel Free Tier: 100 GB bandwidth, unlimited deployments
- Total: $0 for your use case
