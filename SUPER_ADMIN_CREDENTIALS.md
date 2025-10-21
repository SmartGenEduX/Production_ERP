# 🔐 SmartGenEduX - Super Admin Credentials

## First Super Admin Account

### Default Login Credentials

```
┌─────────────────────────────────────────────────┐
│  SMARTGENEDUX ERP SYSTEM                        │
│  Super Admin Account                            │
├─────────────────────────────────────────────────┤
│                                                 │
│  Email:    admin@smartgenedux.com               │
│  Password: Admin@123                            │
│  Role:     super_admin                          │
│                                                 │
│  ⚠️  MUST CHANGE PASSWORD ON FIRST LOGIN       │
│                                                 │
└─────────────────────────────────────────────────┘
```

---

## 🚀 How to Create Super Admin Account

### Step 1: Access Setup Page

After deploying to Vercel, navigate to:

```
https://your-app.vercel.app/super-admin-setup
```

Or locally:
```
http://localhost:5000/super-admin-setup
```

### Step 2: Fill the Form

**Enter the following details:**
- **First Name:** Admin
- **Last Name:** Super
- **Email:** admin@smartgenedux.com

**Click:** "Create Super Admin"

### Step 3: Note the Credentials

The system will display:

```
✅ Super Admin created successfully!

Default Credentials:
Email: admin@smartgenedux.com
Password: Admin@123

⚠️ Please change this password immediately after first login
```

---

## 🔑 First Login Process

### Step 1: Navigate to Login Page

```
https://your-app.vercel.app/
```

### Step 2: Enter Default Credentials

- **Email:** `admin@smartgenedux.com`
- **Password:** `Admin@123`

### Step 3: Change Password (Mandatory)

You will be automatically redirected to the password change page.

**Enter:**
- **Current Password:** `Admin@123`
- **New Password:** (your secure password - min 6 characters)
- **Confirm Password:** (same as new password)

**Click:** "Change Password"

---

## 🛡️ Security Requirements

### Password Policy

Your new password must meet these requirements:

- ✅ Minimum 6 characters (recommended: 12+ characters)
- ✅ Mix of uppercase and lowercase letters
- ✅ Include numbers
- ✅ Include special characters (@, #, $, %, etc.)
- ✅ No common words or patterns
- ✅ No personal information

### Recommended Password Examples

```
StrongPass@2025!
SmartEdu#Secure123
Admin$Genx2025!
Super@Edux#789
```

**DO NOT use:**
- ❌ `admin123`
- ❌ `password`
- ❌ `12345678`
- ❌ Your name or email
- ❌ `Admin@123` (default password)

---

## 👥 Additional Super Admin Accounts

### Create More Super Admins

Once logged in as super admin, you can create additional super admin accounts:

1. **Navigate to:** User Management (coming soon) or use the setup page
2. **Repeat the process** with different email addresses
3. **Each user gets default password:** `Admin@123`
4. **They must change it** on first login

---

## 🔐 Role-Based Access Levels

SmartGenEduX has 7 role-based access levels:

| Role | Access Level | Key Permissions |
|------|--------------|----------------|
| **super_admin** | Full System | All modules, subscription management, system config |
| **principal** | School-wide | All school operations, reports, approvals |
| **school_admin** | Administrative | Student/teacher management, scheduling |
| **ac_incharge** | Academic | Grade management, curriculum, exams |
| **librarian** | Library | Library management, book circulation |
| **teacher** | Classroom | Attendance, grades, assignments |
| **parent** | Student View | Child's progress, fees, attendance |
| **student** | Personal View | Own grades, attendance, assignments |

**Only super_admin can:**
- ✅ Access subscription management
- ✅ Configure system-wide settings
- ✅ Manage multiple schools
- ✅ View audit logs
- ✅ Configure pricing and billing

---

## 🔄 Password Management

### Change Password Anytime

1. **Navigate to:** `/change-password`
2. **Or:** Click your profile → "Change Password"
3. **Enter:**
   - Current password
   - New password
   - Confirm new password
4. **Click:** "Change Password"

### Forgot Password

Currently, password reset must be done by another super admin or database administrator.

**Future Enhancement:** Email-based password reset (coming soon)

---

## 📊 Super Admin Dashboard Access

After login, super admin can access:

### Main Modules

1. **📈 Dashboard** - `/`
   - System overview
   - Key metrics
   - Recent activities

2. **💰 Subscription Management** - `/subscription-management`
   - Create subscription plans
   - Manage school subscriptions
   - Generate invoices
   - View audit logs

3. **🏫 School Management**
   - Add/edit schools
   - Configure per-school settings
   - Manage API keys (WhatsApp, AI, Payment)

4. **👥 User Management**
   - Create users with different roles
   - Assign permissions
   - Deactivate accounts

5. **📊 Reports & Analytics**
   - System-wide reports
   - Financial reports
   - Usage analytics

6. **⚙️ System Configuration**
   - General settings
   - Email configuration
   - Backup settings

---

## 🔒 Security Best Practices

### For Super Admins

1. **Strong Password:**
   - Use password manager
   - Never share password
   - Change every 90 days

2. **Account Security:**
   - Log out after use
   - Don't save password in browser
   - Use secure network only

3. **Access Control:**
   - Create individual accounts (don't share)
   - Review user access regularly
   - Disable inactive accounts

4. **Audit Trail:**
   - Monitor subscription audit logs
   - Review system changes
   - Track invoice generation

5. **API Keys:**
   - Store in database (per-school)
   - Never hardcode in application
   - Rotate regularly

---

## 📝 Quick Reference

### Common URLs

```
Login Page:               /
Change Password:          /change-password
Super Admin Setup:        /super-admin-setup
Subscription Management:  /subscription-management
Dashboard:                /dashboard
```

### Default Credentials (First Time Only)

```
Email:    admin@smartgenedux.com
Password: Admin@123
```

### Support Contact

For technical support or account issues:
- **Email:** support@smartgenedux.com (configure your support email)
- **Phone:** +91-XXXX-XXXXXX (configure your support number)

---

## ⚠️ CRITICAL SECURITY WARNING

```
═══════════════════════════════════════════════════════════
  NEVER SHARE THESE CREDENTIALS PUBLICLY
  
  ❌ Do not commit to GitHub
  ❌ Do not share via email/chat
  ❌ Do not write on paper left unsecured
  ❌ Do not use on untrusted computers
  
  ✅ Use password manager
  ✅ Change immediately after first login
  ✅ Enable 2FA when available
  ✅ Keep credentials confidential
═══════════════════════════════════════════════════════════
```

---

## 🎯 Post-Setup Checklist

After first login and password change:

- [ ] Password changed from default `Admin@123`
- [ ] New password stored securely (password manager)
- [ ] Super admin dashboard accessible
- [ ] Subscription management accessible
- [ ] Additional super admins created (if needed)
- [ ] School accounts created
- [ ] Per-school API keys configured
- [ ] Test login/logout functionality
- [ ] Audit logs reviewed

---

**🎉 Your Super Admin account is ready to use!**

**Remember:** This is the most powerful account in the system. Handle with care and follow all security best practices.

---

*Last Updated: October 21, 2025*
*SmartGenEduX ERP System v1.0*
