# Afalagi Backend — cPanel Deployment Guide

This guide explains step-by-step how to host the **Afalagi NestJS + PostgreSQL Backend** on **cPanel** using the **"Setup Node.js App"** feature (Phusion Passenger).

---

## 1. Prerequisites Checklist

- [x] A cPanel hosting account with **"Setup Node.js App"** enabled (Node.js 18.x, 20.x, or 22.x).
- [x] PostgreSQL database access:
  - **Option A (Recommended)**: cPanel's built-in **PostgreSQL Databases** tool.
  - **Option B**: A free managed cloud PostgreSQL instance (such as [Neon.tech](https://neon.tech), [Supabase](https://supabase.com), or [Render](https://render.com)) if your cPanel host only enables MySQL.
- [x] Access to cPanel **File Manager** or **FTP / SSH**.

---

## 2. Step-by-Step Deployment Instructions

### Step 1: Create the PostgreSQL Database in cPanel

1. Log in to your **cPanel**.
2. Scroll to the **Databases** section and click **PostgreSQL Database Wizard** (or **PostgreSQL Databases**).
3. **Create Database**:
   - Enter database name, e.g. `afalagi_db`.
   - Your full database name will look like: `cpaneluser_afalagi_db`.
4. **Create Database User**:
   - Enter username, e.g. `afalagi_user`.
   - Generate a strong password and save it securely.
   - Full username will look like: `cpaneluser_afalagi_user`.
5. **Assign User to Database**:
   - Grant **ALL PRIVILEGES** to the user for this database.

> **Note on Managed PostgreSQL**: If using Neon/Supabase, get your connection credentials (`host`, `database`, `username`, `password`, `port 5432`) and make sure to set `DB_SSL=true`.

---

### Step 2: Prepare the Backend Files for Upload

On your local machine, the project is already structured and compiled:
1. Build the production files:
   ```bash
   cd backend
   npm run build
   ```
2. The essential files/folders to upload to cPanel are:
   - `dist/` (the compiled JavaScript output)
   - `uploads/` (directory for uploaded missing person photos)
   - `app.js` (Passenger entry point)
   - `package.json`
   - `package-lock.json`
   - `.env`

*(You do **not** need to upload `node_modules` if you intend to run `npm install --omit=dev` inside cPanel, or you can zip everything including `node_modules` and upload the zip).*

---

### Step 3: Create the Node.js Application in cPanel

1. In cPanel, navigate to the **Software** section and click **"Setup Node.js App"**.
2. Click **Create Application**.
3. Fill in the fields:
   * **Node.js version**: Choose **20.x** (or **18.x / 22.x**).
   * **Application mode**: Select **Production**.
   * **Application root**: Enter a directory name, e.g. `afalagi-backend` (this creates a folder in your home directory).
   * **Application URL**: Select your domain or subdomain (e.g. `api.yourdomain.com` or `yourdomain.com/api`).
   * **Application startup file**: Enter `app.js`.
4. Click **Create** (top right).
5. Once created, cPanel displays a command at the top to enter the virtual environment, for example:
   ```bash
   source /home/cpaneluser/nodevenv/afalagi-backend/20/bin/activate && cd /home/cpaneluser/afalagi-backend
   ```

---

### Step 4: Upload Backend Files to cPanel

1. Open cPanel **File Manager**.
2. Navigate to the **Application Root** directory specified in Step 3 (e.g. `/home/cpaneluser/afalagi-backend`).
3. Upload your files (`dist/`, `app.js`, `package.json`, `.env`, `uploads/`).
4. Make sure permissions for the `uploads/` folder are set to `755` so uploaded images can be saved and served.

---

### Step 5: Configure Environment Variables (.env)

Edit the `.env` file inside your cPanel application root (or enter them into the "Environment variables" section in "Setup Node.js App"):

```env
PORT=3000
NODE_ENV=production

# Database Connection (from Step 1)
DB_HOST=localhost
DB_PORT=5432
DB_DATABASE=cpaneluser_afalagi_db
DB_USERNAME=cpaneluser_afalagi_user
DB_PASSWORD=YourStrongDatabasePasswordHere

# If using Neon / Supabase, set to true
DB_SSL=false

# Automatically synchronizes tables (creates users and reports tables on first boot)
DB_SYNCHRONIZE=true

# Security Keys
JWT_SECRET=replace_with_a_long_random_secret_string_min_32_characters
JWT_EXPIRES_IN=7d

# CORS (Frontend URL or * for all)
ALLOWED_ORIGINS=*
```

---

### Step 6: Install Production Dependencies in cPanel

In the **Setup Node.js App** page:
1. Click **Run NPM Install** (or open the cPanel Terminal and run `npm install --omit=dev`).
2. Once installed, click **Restart** at the top of the Node.js App page.

---

### Step 7: Verify Application Health

1. Open your browser and navigate to:
   ```
   https://api.yourdomain.com/api/health
   ```
   or
   ```
   https://yourdomain.com/api/health
   ```
2. You will receive a JSON response:
   ```json
   {
     "status": "ok",
     "timestamp": "2026-10-26T...",
     "uptime": 12.34
   }
   ```
3. The root endpoint (`https://api.yourdomain.com/api`) also outputs the full API route map.
4. On first startup, the application **automatically seeds**:
   - Initial missing person reports (Abebe Bekele, Fatima Ali, Yosef Tadesse)
   - Default Administrator account:
     - **Email**: `admin@afalagi.et`
     - **Password**: `Admin@123456`

---

## 3. Connecting the Frontend to the Backend

In your frontend root, set the environment variable `.env.production` (or `.env`):

```env
VITE_API_URL=https://api.yourdomain.com/api
```

Build the frontend:
```bash
npm run build
```
And upload the contents of the `dist/` directory to `public_html` on cPanel.
