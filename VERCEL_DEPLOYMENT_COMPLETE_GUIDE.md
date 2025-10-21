# SmartGenEduX - Complete Vercel Deployment Guide

## 📋 Pre-Deployment Checklist

### Required Accounts
- ✅ GitHub account (for repository hosting)
- ✅ Vercel account (sign up at vercel.com - free for personal projects)
- ✅ Database (using Neon PostgreSQL - already configured)

---

## 🚀 Step-by-Step Deployment Guide

### Step 1: Push Code to GitHub

1. **Create a new GitHub repository:**
   - Go to https://github.com/new
   - Repository name: `smartgenedux-erp`
   - Set to Private (recommended for production)
   - Do NOT initialize with README (we already have code)
   - Click "Create repository"

2. **Initialize and push your code:**
   ```bash
   # Initialize git if not already done
   git init
   
   # Add all files
   git add .
   
   # Commit
   git commit -m "Initial commit: SmartGenEduX ERP System v1.0"
   
   # Add your GitHub repository as remote
   git remote add origin https://github.com/YOUR_USERNAME/smartgenedux-erp.git
   
   # Push to GitHub
   git branch -M main
   git push -u origin main
   ```

---

### Step 2: Connect Vercel to GitHub

1. **Login to Vercel:**
   - Go to https://vercel.com
   - Click "Sign Up" or "Login"
   - Choose "Continue with GitHub"
   - Authorize Vercel to access your GitHub account

2. **Import your project:**
   - Click "Add New..." → "Project"
   - Find `smartgenedux-erp` in the repository list
   - Click "Import"

---

### Step 3: Configure Project Settings

#### Framework Settings:
- **Framework Preset:** Other
- **Build Command:** `npm run build`
- **Output Directory:** `dist/public`
- **Install Command:** `npm install`
- **Development Command:** `npm run dev`

#### Root Directory:
- Leave as `.` (root)

---

### Step 4: Configure Environment Variables

**CRITICAL:** Add these environment variables in Vercel:

1. Click "Environment Variables" section during import (or Settings → Environment Variables after import)

2. **Required Variables:**

```env
# Database Configuration (from your Neon PostgreSQL)
DATABASE_URL=postgresql://username:password@host/database?sslmode=require

# Session Secret (generate a strong random string)
SESSION_SECRET=your-super-secure-random-secret-key-change-this

# Node Environment
NODE_ENV=production
```

3. **Optional API Keys** (add only if using these features):

```env
# OpenAI API (for AI features)
OPENAI_API_KEY=sk-your-openai-key

# Google Gemini API (for AI features)
GEMINI_API_KEY=your-gemini-key

# Stripe (for payment processing)
STRIPE_SECRET_KEY=sk_live_your-stripe-key
VITE_STRIPE_PUBLIC_KEY=pk_live_your-stripe-public-key
```

**Important Notes:**
- Click "Add" after entering each variable
- These are per-school API keys stored in database - system-wide keys are optional
- For `SESSION_SECRET`, generate using: `openssl rand -base64 32` or use a password generator

---

### Step 5: Deploy

1. **Click "Deploy"**
   - Vercel will start building your application
   - Build process takes 2-5 minutes
   - Watch the deployment logs for any errors

2. **Wait for deployment to complete**
   - You'll see "Building..." → "Deploying..." → "Ready"
   - Once complete, you'll get a production URL like: `https://smartgenedux-erp.vercel.app`

---

### Step 6: Post-Deployment Setup

#### 1. Access Your Application
   - Click the provided URL (e.g., `https://smartgenedux-erp.vercel.app`)
   - You should see the login page

#### 2. Create First Super Admin User
   
   **Navigate to:** `https://your-app.vercel.app/super-admin-setup`

   **Fill in the form:**
   - First Name: `Admin`
   - Last Name: `Super`
   - Email: `admin@smartgenedux.com`
   
   **Click "Create Super Admin"**

   **Default Credentials Generated:**
   ```
   Email: admin@smartgenedux.com
   Password: Admin@123
   ```

   **⚠️ CRITICAL:** You MUST change this password immediately after first login!

#### 3. First Login
   
   **Navigate to:** `https://your-app.vercel.app/`
   
   **Login with:**
   - Email: `admin@smartgenedux.com`
   - Password: `Admin@123`
   
   **You will be prompted to change password immediately**

#### 4. Change Default Password
   
   - You'll be redirected to `/change-password`
   - Enter current password: `Admin@123`
   - Enter new strong password (min 6 characters)
   - Confirm new password
   - Click "Change Password"

---

## 🔒 Super Admin Default Credentials

### First Super Admin Account

```
Email:    admin@smartgenedux.com
Password: Admin@123
Role:     super_admin

⚠️ MUST CHANGE PASSWORD ON FIRST LOGIN
```

**Security Recommendations:**
1. Change the default password immediately
2. Use a strong password (12+ characters, mixed case, numbers, symbols)
3. Store credentials securely (password manager recommended)
4. Create additional super admin accounts if needed
5. Never share super admin credentials

---

## 🔄 Continuous Deployment (Automatic Updates)

Once connected, Vercel automatically deploys:
- ✅ Every push to `main` branch → Production deployment
- ✅ Every pull request → Preview deployment
- ✅ Automatic rollback if deployment fails

**To deploy updates:**
```bash
# Make your changes
git add .
git commit -m "Your update message"
git push origin main

# Vercel automatically deploys in ~2-5 minutes
```

---

## 📊 Post-Deployment Verification

### Test These Features:

1. **✅ Login System**
   - Super admin login works
   - Password change works
   - JWT authentication active

2. **✅ Dashboard Access**
   - Super admin can access all modules
   - Role-based access control working

3. **✅ Database Connection**
   - Data persists across sessions
   - CRUD operations work
   - Migrations applied correctly

4. **✅ Subscription Management**
   - Navigate to `/subscription-management`
   - Create subscription plans
   - Assign to schools
   - Generate invoices

---

## 🐛 Troubleshooting

### Common Issues:

**1. Build Fails:**
```
Error: Cannot find module 'xyz'
```
**Solution:** Check package.json has all dependencies, run `npm install` locally first

**2. Database Connection Error:**
```
Error: getaddrinfo ENOTFOUND
```
**Solution:** Verify DATABASE_URL is correct in Vercel environment variables

**3. 500 Internal Server Error:**
```
Internal Server Error
```
**Solution:** Check Vercel deployment logs (Dashboard → Deployments → View Function Logs)

**4. Session/Auth Issues:**
```
Unauthorized: Invalid token
```
**Solution:** Ensure SESSION_SECRET is set in Vercel environment variables

**5. Environment Variables Not Working:**
- Go to Vercel Dashboard → Settings → Environment Variables
- Ensure all variables are added
- Redeploy after adding variables

---

## 🔧 Vercel Configuration Details

The project includes `vercel.json` with optimized settings:

```json
{
  "version": 2,
  "builds": [
    {
      "src": "package.json",
      "use": "@vercel/node"
    }
  ],
  "routes": [
    {
      "src": "/api/(.*)",
      "dest": "/server/index.ts"
    },
    {
      "src": "/(.*)",
      "dest": "/server/index.ts"
    }
  ]
}
```

**Features:**
- ✅ Serverless function deployment
- ✅ Automatic HTTPS/SSL
- ✅ Global CDN
- ✅ Auto-scaling
- ✅ DDoS protection

---

## 📈 Monitoring & Analytics

### Vercel Dashboard Features:

1. **Deployment Logs:**
   - View build and runtime logs
   - Debug errors in real-time

2. **Analytics:**
   - Page views and performance
   - Core Web Vitals
   - User behavior tracking

3. **Function Logs:**
   - API endpoint performance
   - Error tracking
   - Response times

**Access:** https://vercel.com/dashboard → Select your project

---

## 🌐 Custom Domain Setup (Optional)

### Add Your Own Domain:

1. **In Vercel Dashboard:**
   - Go to Settings → Domains
   - Click "Add Domain"
   - Enter your domain (e.g., `smartgenedux.com`)

2. **Configure DNS:**
   - Add CNAME record pointing to Vercel
   - Vercel provides exact DNS settings
   - SSL certificate auto-generated

3. **Wait for DNS propagation:**
   - Usually 5-30 minutes
   - Up to 48 hours in some cases

---

## 🎯 Production Checklist

Before going live with real users:

- [ ] Super admin password changed from default
- [ ] DATABASE_URL points to production database
- [ ] SESSION_SECRET is strong and unique
- [ ] All environment variables configured
- [ ] Test login/logout functionality
- [ ] Test role-based access control
- [ ] Verify subscription management works
- [ ] Test invoice generation
- [ ] Check database backups are enabled
- [ ] Review Vercel analytics/monitoring
- [ ] Document admin procedures
- [ ] Train super admin users

---

## 📞 Support & Resources

### Official Documentation:
- Vercel Docs: https://vercel.com/docs
- Neon Database: https://neon.tech/docs
- Next Deployment: https://vercel.com/docs/deployments

### Quick Commands:

```bash
# View deployment status
vercel ls

# View logs
vercel logs

# Rollback to previous deployment
vercel rollback

# Pull environment variables locally
vercel env pull
```

---

## 🎉 Deployment Complete!

Your SmartGenEduX ERP System is now live at:
**https://your-project.vercel.app**

**Super Admin Access:**
- Email: `admin@smartgenedux.com`
- Password: `Admin@123` (change immediately!)

**Next Steps:**
1. ✅ Login and change password
2. ✅ Configure subscription plans
3. ✅ Add schools and users
4. ✅ Configure per-school API keys
5. ✅ Start using the system!

---

## 🔐 Security Best Practices

1. **Password Policy:**
   - Minimum 8 characters
   - Mix of uppercase, lowercase, numbers, symbols
   - Change every 90 days
   - No password reuse

2. **Access Control:**
   - Review user roles regularly
   - Disable inactive accounts
   - Monitor audit logs
   - Use 2FA when available

3. **Database Security:**
   - Regular backups (Neon handles this)
   - Connection always over SSL
   - Rotate credentials periodically

4. **API Keys:**
   - Store per-school in encrypted database
   - Never commit to code
   - Rotate regularly
   - Monitor usage

---

**Congratulations! Your SmartGenEduX ERP System is production-ready! 🚀**
