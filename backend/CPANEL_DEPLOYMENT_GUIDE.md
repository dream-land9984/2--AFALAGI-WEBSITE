# Afalagi Backend — cPanel Database & Deployment Guide

## Why is there only "Database Wizard" in cPanel?

In almost all cPanel shared hosting providers, **"Database Wizard"** refers to **MySQL / MariaDB**. Hosting companies rarely install PostgreSQL on shared servers because MySQL is the industry standard for cPanel.

**Good news**: You do not have to change any code! The NestJS backend has been updated to seamlessly support **both MySQL and PostgreSQL**.

You can choose whichever path fits you best:
- **Path 1 (Recommended & Easiest)**: Use your cPanel's built-in **Database Wizard (MySQL)**. Zero external services needed.
- **Path 2**: Use a **Free Cloud PostgreSQL database** (e.g. Neon.tech or Supabase) connected to your cPanel Node.js app.

---

## PATH 1: Using cPanel's Built-in "Database Wizard" (MySQL)

### Step 1: Create Database in cPanel
1. In cPanel, click **Database Wizard** (or **MySQL Databases**).
2. **Step 1 - Create A Database**:
   - Type a database name, e.g. `afalagi`.
   - Your full database name will be: `yourusername_afalagi`.
   - Click **Next Step**.
3. **Step 2 - Create Database Users**:
   - Type a username, e.g. `afalagi_user`.
   - Full username: `yourusername_afalagi_user`.
   - Generate a strong password, copy it, and click **Create User**.
4. **Step 3 - Add User to the Database**:
   - Check the box **ALL PRIVILEGES**.
   - Click **Make Changes**.

---

### Step 2: Configure `.env` on cPanel

In your cPanel app root (`/home/yourusername/afalagi-backend/.env`), set:

```env
PORT=3000
NODE_ENV=production

# Set DB_TYPE to mysql for cPanel's Database Wizard
DB_TYPE=mysql
DB_HOST=localhost
DB_PORT=3306
DB_DATABASE=yourusername_afalagi
DB_USERNAME=yourusername_afalagi_user
DB_PASSWORD=YourCopiedPasswordHere

# SSL not needed for local cPanel MySQL
DB_SSL=false

# Automatically creates tables and seeds initial data
DB_SYNCHRONIZE=true

# Security
JWT_SECRET=replace_with_a_random_32_character_string_here
JWT_EXPIRES_IN=7d
ALLOWED_ORIGINS=*
```

---

## PATH 2: Using Free Cloud PostgreSQL (If You Require PostgreSQL)

If your project specifically mandates PostgreSQL:

1. Go to **[Neon.tech](https://neon.tech)** or **[Supabase.com](https://supabase.com)** (both offer free managed PostgreSQL).
2. Create a free project and copy your connection details from their dashboard:
   - Host (e.g. `ep-cold-pond-123456.us-east-2.aws.neon.tech`)
   - Database (e.g. `neondb`)
   - Username (e.g. `neondb_owner`)
   - Password
3. In your cPanel `.env`, set:
   ```env
   DB_TYPE=postgres
   DB_HOST=ep-cold-pond-123456.us-east-2.aws.neon.tech
   DB_PORT=5432
   DB_DATABASE=neondb
   DB_USERNAME=neondb_owner
   DB_PASSWORD=YourNeonPassword
   DB_SSL=true
   DB_SYNCHRONIZE=true
   ```

---

## Setting up the Node.js App in cPanel

1. In cPanel, open **"Setup Node.js App"**.
2. Click **Create Application**:
   - **Node.js version**: 20.x (or 18.x / 22.x)
   - **Application mode**: Production
   - **Application root**: `afalagi-backend`
   - **Application URL**: Select your domain or subdomain (e.g. `api.yourdomain.com`)
   - **Application startup file**: `app.js`
3. Click **Create**.
4. In cPanel **File Manager**, upload these files from your computer to `/home/yourusername/afalagi-backend`:
   - `dist/` (compiled code)
   - `uploads/`
   - `app.js`
   - `package.json`
   - `.env`
5. Back in **Setup Node.js App**, click **Run NPM Install** (or install dependencies via SSH/Terminal).
6. Click **Restart**.

---

## Verification & Testing

Visit `https://api.yourdomain.com/api/health` in your browser. You should see:
```json
{
  "status": "ok",
  "timestamp": "2026-10-26T...",
  "uptime": 5.2
}
```

The database tables (`users`, `reports`) and initial sample reports (Abebe Bekele, Fatima Ali, Yosef Tadesse) are automatically created on first startup!
