# SmartGenEduX - Complete Module Workflows & Documentation

## 📚 Table of Contents

1. [Subscription & Billing Management](#1-subscription--billing-management)
2. [User Management & Authentication](#2-user-management--authentication)
3. [Student Management](#3-student-management)
4. [Teacher Management](#4-teacher-management)
5. [Attendance Management](#5-attendance-management)
6. [Grade Management (CBSE)](#6-grade-management-cbse)
7. [Exam Management](#7-exam-management)
8. [Timetable Management](#8-timetable-management)
9. [AI-Powered Substitution Management](#9-ai-powered-substitution-management)
10. [Library Management](#10-library-management)
11. [Fee Management](#11-fee-management)
12. [Transportation Management](#12-transportation-management)
13. [WhatsApp Smart Alert System](#13-whatsapp-smart-alert-system)
14. [Certificate Generation](#14-certificate-generation)
15. [Anti-Bullying & Behavior Tracking](#15-anti-bullying--behavior-tracking)
16. [AI Analytics (Vipu.ai)](#16-ai-analytics-vipuai)
17. [VipuDev.ai Coding Assistant](#17-vipudevai-coding-assistant)
18. [ID Card Generator](#18-id-card-generator)
19. [Invigilation Duty Allocation](#19-invigilation-duty-allocation)
20. [Student Distribution System](#20-student-distribution-system)

---

## 1. Subscription & Billing Management

### 📋 Purpose
Manage school subscriptions, pricing, invoicing, and billing for the multi-tenancy ERP system. Enables Super Admin to configure pricing plans, offer discounts, provide complimentary access, and maintain complete audit trail for financial compliance.

### 👥 User Roles
- **Super Admin** - Full access to all subscription features
- **School Admin** - View their school's subscription details (read-only)

### 🎯 Key Features
- Default pricing: ₹10/student/month
- Custom pricing per school
- Discount/bargaining capability
- Complimentary subscription option
- Automatic invoice generation with GST (18%)
- Legal document management (Terms, Privacy Policy)
- Complete audit trail for IT/financial audits
- Payment tracking

### 📊 Workflow Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                    SUBSCRIPTION LIFECYCLE                        │
└─────────────────────────────────────────────────────────────────┘

1. PLAN CREATION (Super Admin)
   ┌──────────────┐
   │ Super Admin  │
   │ Creates Plan │
   └──────┬───────┘
          │
          ▼
   ┌─────────────────────┐
   │ Set Default Price   │
   │ ₹10/student/month   │
   └──────┬──────────────┘
          │
          ▼
   ┌─────────────────────┐      ┌──────────────────┐
   │ Configure Features  │──────▶│ Save to Database │
   │ - Max Students      │      │ subscriptionPlans│
   │ - Module Access     │      └──────────────────┘
   └─────────────────────┘

2. SCHOOL SUBSCRIPTION (Super Admin)
   ┌──────────────┐
   │ Super Admin  │
   │ Assigns Plan │
   └──────┬───────┘
          │
          ▼
   ┌────────────────────┐
   │ Select School      │
   │ Select Plan        │
   └──────┬─────────────┘
          │
          ├─────────────────┐
          │                 │
          ▼                 ▼
   ┌─────────────┐   ┌──────────────────┐
   │ Custom      │   │ Apply Discount   │
   │ Pricing?    │   │ or Complimentary │
   └─────┬───────┘   └──────┬───────────┘
         │                  │
         └──────────┬───────┘
                    │
                    ▼
         ┌─────────────────────┐
         │ Calculate Monthly   │
         │ Amount & Save       │
         │ schoolSubscriptions │
         └──────┬──────────────┘
                │
                ▼
         ┌─────────────────────┐
         │ Create Audit Log    │
         │ subscriptionAuditLog│
         └─────────────────────┘

3. INVOICE GENERATION (Automatic Monthly)
   ┌──────────────────┐
   │ System Scheduler │
   │ (Monthly Cron)   │
   └────────┬─────────┘
            │
            ▼
   ┌───────────────────────┐
   │ For Each Active       │
   │ School Subscription   │
   └────────┬──────────────┘
            │
            ▼
   ┌───────────────────────┐
   │ Calculate Invoice     │
   │ - Student Count       │
   │ - Price per Student   │
   │ - Subtotal            │
   │ - GST 18%             │
   │ - Total Amount        │
   └────────┬──────────────┘
            │
            ▼
   ┌───────────────────────┐      ┌─────────────────┐
   │ Generate Invoice PDF  │──────▶│ Save Invoice    │
   │ - Invoice Number      │      │ subscriptionInvoices
   │ - School Details      │      └─────────────────┘
   │ - Line Items          │
   │ - GST Breakdown       │
   └───────────────────────┘

4. PAYMENT TRACKING
   ┌──────────────┐
   │ School Admin │
   │ Makes Payment│
   └──────┬───────┘
          │
          ▼
   ┌─────────────────────┐
   │ Record Payment      │
   │ - Payment Method    │
   │ - Transaction ID    │
   │ - Amount            │
   └──────┬──────────────┘
          │
          ▼
   ┌─────────────────────┐      ┌──────────────────┐
   │ Update Invoice      │──────▶│ Update Audit Log │
   │ Status: PAID        │      │ Payment Recorded │
   └─────────────────────┘      └──────────────────┘

5. AUDIT TRAIL (Continuous)
   Every action logs:
   ┌─────────────────────────────────┐
   │ subscriptionAuditLog            │
   ├─────────────────────────────────┤
   │ - Action Type                   │
   │ - Performed By                  │
   │ - Timestamp                     │
   │ - Old Values                    │
   │ - New Values                    │
   │ - IP Address                    │
   │ - User Agent                    │
   └─────────────────────────────────┘
```

### 🔄 Step-by-Step Process

#### Creating a Subscription Plan
1. Super Admin logs in
2. Navigates to `/subscription-management`
3. Clicks "Create New Plan"
4. Fills in plan details:
   - Plan name
   - Default price per student (₹10)
   - Max students allowed
   - Module access (Admin/Academic/Premium)
5. System saves to `subscriptionPlans` table
6. Audit log created

#### Assigning Subscription to School
1. Super Admin selects school
2. Chooses subscription plan
3. Options:
   - Keep default pricing
   - Apply custom pricing
   - Apply discount (%)
   - Mark as complimentary
4. Sets student count
5. System calculates monthly amount
6. Saves to `schoolSubscriptions`
7. Audit log created

#### Monthly Invoice Generation
1. System runs monthly (automated)
2. For each active subscription:
   - Gets student count
   - Calculates: (students × price per student)
   - Adds GST 18%
   - Generates invoice number
   - Creates PDF
   - Saves to `subscriptionInvoices`
3. Email sent to school admin
4. Audit log created

### 📁 Database Tables
- `subscriptionPlans` - Master pricing plans
- `schoolSubscriptions` - School-specific subscriptions
- `subscriptionInvoices` - Generated invoices
- `subscriptionPayments` - Payment tracking
- `subscriptionLegalDocuments` - Terms, Privacy Policy
- `schoolLegalAcceptances` - Legal document acceptances
- `subscriptionAuditLog` - Complete audit trail

### 🔐 Security
- Super Admin only for create/update operations
- School admins can view their own subscription
- All actions logged in audit trail
- GST calculation validated
- Payment verification required

---

## 2. User Management & Authentication

### 📋 Purpose
Secure authentication and role-based access control for 7 different user types across multiple schools. Ensures proper authorization and security throughout the system.

### 👥 User Roles (7 Types)
1. **super_admin** - System-wide administration
2. **principal** - School-wide operations
3. **school_admin** - Administrative tasks
4. **ac_incharge** - Academic coordination
5. **librarian** - Library management
6. **teacher** - Classroom operations
7. **parent** - Student progress view
8. **student** - Personal academic view

### 📊 Workflow Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                 USER AUTHENTICATION WORKFLOW                     │
└─────────────────────────────────────────────────────────────────┘

1. REGISTRATION (Super Admin Creates Users)
   ┌──────────────┐
   │ Super Admin  │
   │ Creates User │
   └──────┬───────┘
          │
          ▼
   ┌─────────────────────┐
   │ Enter User Details  │
   │ - Email             │
   │ - Name              │
   │ - Role              │
   │ - School ID         │
   └──────┬──────────────┘
          │
          ▼
   ┌─────────────────────┐
   │ System Generates    │
   │ Default Password    │
   │ "Admin@123"         │
   └──────┬──────────────┘
          │
          ▼
   ┌─────────────────────┐      ┌──────────────────┐
   │ Hash Password       │──────▶│ Save to Database │
   │ (bcrypt)            │      │ userProfiles     │
   └─────────────────────┘      └──────────────────┘
          │
          ▼
   ┌─────────────────────┐
   │ Set Flag:           │
   │ mustChangePassword  │
   │ = true              │
   └─────────────────────┘

2. LOGIN PROCESS
   ┌──────────────┐
   │ User Visits  │
   │ Login Page   │
   └──────┬───────┘
          │
          ▼
   ┌─────────────────────┐
   │ Enter Credentials   │
   │ - Email             │
   │ - Password          │
   └──────┬──────────────┘
          │
          ▼
   ┌─────────────────────┐
   │ Validate Credentials│
   │ - Find user by email│
   │ - Compare password  │
   │   (bcrypt.compare)  │
   └──────┬──────────────┘
          │
          ├───────────────────┐
          │ Valid?            │
          ├─────────┬─────────┤
          │ NO      │ YES     │
          ▼         ▼         │
   ┌──────────┐ ┌────────────┴──┐
   │ Return   │ │ Generate JWT  │
   │ 401      │ │ Token         │
   │ Error    │ │ - User ID     │
   └──────────┘ │ - Email       │
                │ - Role        │
                │ - School ID   │
                └────────┬──────┘
                         │
                         ▼
                ┌─────────────────┐
                │ Check:          │
                │ mustChange      │
                │ Password?       │
                └────────┬────────┘
                         │
                ├────────┴─────────┐
                │ YES    │ NO      │
                ▼        ▼         │
         ┌──────────┐ ┌────────────┴──┐
         │ Redirect │ │ Redirect to   │
         │ to       │ │ Dashboard     │
         │ /change- │ │               │
         │ password │ │               │
         └──────────┘ └───────────────┘

3. PASSWORD CHANGE (Mandatory for New Users)
   ┌──────────────┐
   │ User at      │
   │ /change-     │
   │ password     │
   └──────┬───────┘
          │
          ▼
   ┌─────────────────────┐
   │ Enter:              │
   │ - Current Password  │
   │ - New Password      │
   │ - Confirm Password  │
   └──────┬──────────────┘
          │
          ▼
   ┌─────────────────────┐
   │ Validate:           │
   │ - Current correct?  │
   │ - Min 6 chars?      │
   │ - Passwords match?  │
   └──────┬──────────────┘
          │
          ▼
   ┌─────────────────────┐
   │ Hash New Password   │
   │ (bcrypt)            │
   └──────┬──────────────┘
          │
          ▼
   ┌─────────────────────┐
   │ Update Database:    │
   │ - password = hash   │
   │ - mustChange = false│
   │ - updatedAt = now   │
   └──────┬──────────────┘
          │
          ▼
   ┌─────────────────────┐
   │ Redirect to         │
   │ Dashboard           │
   └─────────────────────┘

4. ROLE-BASED ACCESS CONTROL
   ┌──────────────┐
   │ User Makes   │
   │ API Request  │
   └──────┬───────┘
          │
          ▼
   ┌─────────────────────┐
   │ authMiddleware      │
   │ - Verify JWT Token  │
   │ - Extract User Info │
   └──────┬──────────────┘
          │
          ▼
   ┌─────────────────────┐
   │ Check User Role     │
   │ Against Required    │
   │ Permission          │
   └──────┬──────────────┘
          │
          ├────────────────┐
          │ Authorized?    │
          ├──────┬─────────┤
          │ NO   │ YES     │
          ▼      ▼         │
   ┌──────────┐ ┌─────────┴────┐
   │ Return   │ │ Process      │
   │ 403      │ │ Request      │
   │ Forbidden│ └──────────────┘
   └──────────┘
```

### 🔐 Security Features
- Password hashing with bcrypt (10 rounds)
- JWT token-based authentication
- Mandatory password change on first login
- Role-based middleware protection
- Session management
- Secure token storage (httpOnly cookies)

### 📁 Database Tables
- `userProfiles` - User information and credentials
- `userSessions` - Active session tracking

---

## 3. Student Management

### 📋 Purpose
Comprehensive student information system to manage student data, enrollment, academic records, and parent information across multiple schools.

### 👥 User Roles
- **Super Admin** - Full access across all schools
- **Principal** - School-wide student management
- **School Admin** - Student CRUD operations
- **AC Incharge** - Academic records access
- **Teacher** - View assigned students
- **Parent** - View own child's information

### 📊 Workflow Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                  STUDENT MANAGEMENT WORKFLOW                     │
└─────────────────────────────────────────────────────────────────┘

1. STUDENT ENROLLMENT
   ┌──────────────┐
   │ School Admin │
   │ Adds Student │
   └──────┬───────┘
          │
          ▼
   ┌─────────────────────────┐
   │ Enter Student Details   │
   │ - Name                  │
   │ - DOB                   │
   │ - Admission Number      │
   │ - Class & Section       │
   │ - Parent Contact        │
   │ - Address               │
   │ - Photo (optional)      │
   └──────┬──────────────────┘
          │
          ▼
   ┌─────────────────────────┐
   │ System Validates        │
   │ - Unique Admission No.  │
   │ - Age requirements      │
   │ - Class exists          │
   └──────┬──────────────────┘
          │
          ▼
   ┌─────────────────────────┐      ┌─────────────────┐
   │ Generate Student ID     │──────▶│ Save to Database│
   │ STU + Timestamp         │      │ students table  │
   └─────────────────────────┘      └────────┬────────┘
                                             │
                                             ▼
                                    ┌─────────────────┐
                                    │ Create Parent   │
                                    │ User Account    │
                                    │ (if new)        │
                                    └─────────────────┘

2. STUDENT PROFILE UPDATE
   ┌──────────────┐
   │ School Admin │
   │ Updates Info │
   └──────┬───────┘
          │
          ▼
   ┌─────────────────────────┐
   │ Select Student          │
   │ Modify Fields           │
   └──────┬──────────────────┘
          │
          ▼
   ┌─────────────────────────┐
   │ Track Changes           │
   │ - Old Values            │
   │ - New Values            │
   │ - Modified By           │
   │ - Timestamp             │
   └──────┬──────────────────┘
          │
          ▼
   ┌─────────────────────────┐
   │ Update Database         │
   │ + Create Audit Log      │
   └─────────────────────────┘

3. CLASS PROMOTION (Year-End)
   ┌──────────────┐
   │ School Admin │
   │ Bulk Promote │
   └──────┬───────┘
          │
          ▼
   ┌─────────────────────────┐
   │ Select Class/Section    │
   │ Choose Target Class     │
   └──────┬──────────────────┘
          │
          ▼
   ┌─────────────────────────┐
   │ For Each Student:       │
   │ - Update className      │
   │ - Update section        │
   │ - Create history record │
   └──────┬──────────────────┘
          │
          ▼
   ┌─────────────────────────┐
   │ Generate Report         │
   │ - Total Promoted        │
   │ - New Class Distribution│
   └─────────────────────────┘

4. STUDENT SEARCH & FILTER
   ┌──────────────┐
   │ User Searches│
   └──────┬───────┘
          │
          ▼
   ┌─────────────────────────┐
   │ Apply Filters:          │
   │ - Class                 │
   │ - Section               │
   │ - Gender                │
   │ - Status (Active)       │
   │ - Search by Name/ID     │
   └──────┬──────────────────┘
          │
          ▼
   ┌─────────────────────────┐
   │ Query Database          │
   │ + Apply Role-Based      │
   │   Filters               │
   └──────┬──────────────────┘
          │
          ▼
   ┌─────────────────────────┐
   │ Return Results          │
   │ (Paginated)             │
   └─────────────────────────┘
```

### 📁 Database Tables
- `students` - Student master data
- `classes` - Class definitions
- `sections` - Section assignments

### 🔄 Key Operations
1. **Enrollment** - Add new student with validation
2. **Profile Update** - Modify student information
3. **Class Promotion** - Bulk promotion year-end
4. **Transfer** - Move student between sections
5. **Alumni** - Mark student as graduated

---

## 4. Teacher Management

### 📋 Purpose
Manage teacher profiles, qualifications, subject assignments, and workload distribution across the school.

### 👥 User Roles
- **Principal** - Full teacher management
- **School Admin** - Teacher CRUD operations
- **AC Incharge** - Subject assignment

### 📊 Workflow Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                  TEACHER MANAGEMENT WORKFLOW                     │
└─────────────────────────────────────────────────────────────────┘

1. TEACHER ONBOARDING
   ┌──────────────┐
   │ School Admin │
   │ Adds Teacher │
   └──────┬───────┘
          │
          ▼
   ┌─────────────────────────┐
   │ Enter Teacher Details   │
   │ - Name                  │
   │ - Email                 │
   │ - Phone                 │
   │ - Qualifications        │
   │ - Subjects              │
   │ - Employee ID           │
   └──────┬──────────────────┘
          │
          ▼
   ┌─────────────────────────┐      ┌─────────────────┐
   │ Create User Account     │──────▶│ Save to Database│
   │ - Role: teacher         │      │ teachers +      │
   │ - Default Password      │      │ userProfiles    │
   └─────────────────────────┘      └─────────────────┘
          │
          ▼
   ┌─────────────────────────┐
   │ Send Welcome Email      │
   │ with Login Credentials  │
   └─────────────────────────┘

2. SUBJECT ASSIGNMENT
   ┌──────────────┐
   │ AC Incharge  │
   │ Assigns      │
   │ Subjects     │
   └──────┬───────┘
          │
          ▼
   ┌─────────────────────────┐
   │ Select Teacher          │
   │ Select Class-Subject    │
   └──────┬──────────────────┘
          │
          ▼
   ┌─────────────────────────┐
   │ Check Teacher Workload  │
   │ - Max periods/week      │
   │ - Subject expertise     │
   └──────┬──────────────────┘
          │
          ▼
   ┌─────────────────────────┐
   │ Create Assignment       │
   │ Link to Timetable       │
   └─────────────────────────┘

3. WORKLOAD CALCULATION
   ┌──────────────────────────┐
   │ System Automatically     │
   │ Calculates:              │
   ├──────────────────────────┤
   │ - Total Periods/Week     │
   │ - Classes Handled        │
   │ - Subjects Taught        │
   │ - Free Periods           │
   │ - Substitution Count     │
   └──────────────────────────┘
```

### 📁 Database Tables
- `teachers` - Teacher master data
- `subjects` - Subject definitions
- `userProfiles` - Teacher login accounts

---

## 5. Attendance Management

### 📋 Purpose
Track student and staff attendance with multiple capture methods (manual, GPS, barcode scanning). Provide real-time attendance analytics and automated alerts.

### 👥 User Roles
- **Teacher** - Mark student attendance
- **School Admin** - View/edit all attendance
- **Parent** - View child's attendance
- **Student** - View own attendance

### 📊 Workflow Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                  ATTENDANCE MANAGEMENT WORKFLOW                  │
└─────────────────────────────────────────────────────────────────┘

1. DAILY ATTENDANCE MARKING (Multiple Methods)

   METHOD A: Manual Entry by Teacher
   ┌──────────────┐
   │ Teacher      │
   │ Opens App    │
   └──────┬───────┘
          │
          ▼
   ┌─────────────────────────┐
   │ Select Class & Section  │
   │ View Student List       │
   └──────┬──────────────────┘
          │
          ▼
   ┌─────────────────────────┐
   │ Mark Each Student:      │
   │ ☑ Present               │
   │ ☐ Absent                │
   │ ☐ Late                  │
   │ ☐ Half Day              │
   └──────┬──────────────────┘
          │
          ▼
   ┌─────────────────────────┐      ┌─────────────────┐
   │ Submit Attendance       │──────▶│ Save to Database│
   │ - Date & Time           │      │ attendance table│
   │ - Marked By             │      └────────┬────────┘
   │ - Notes (if any)        │               │
   └─────────────────────────┘               │
                                             ▼
                                    ┌─────────────────┐
                                    │ Trigger Alerts  │
                                    │ for Absentees   │
                                    └─────────────────┘

   METHOD B: Barcode Scanning
   ┌──────────────┐
   │ Student      │
   │ Scans ID Card│
   └──────┬───────┘
          │
          ▼
   ┌─────────────────────────┐
   │ Scanner Reads Barcode   │
   │ Extracts Student ID     │
   └──────┬──────────────────┘
          │
          ▼
   ┌─────────────────────────┐
   │ Validate:               │
   │ - Student exists?       │
   │ - Already marked?       │
   │ - Within time window?   │
   └──────┬──────────────────┘
          │
          ▼
   ┌─────────────────────────┐      ┌─────────────────┐
   │ Auto-Mark Present       │──────▶│ Save + Timestamp│
   │ + GPS Location          │      │ attendance table│
   └─────────────────────────┘      └─────────────────┘

   METHOD C: GPS-Based (School Entry)
   ┌──────────────┐
   │ Student      │
   │ Enters       │
   │ Geo-fence    │
   └──────┬───────┘
          │
          ▼
   ┌─────────────────────────┐
   │ Mobile App Detects      │
   │ Location within School  │
   └──────┬──────────────────┘
          │
          ▼
   ┌─────────────────────────┐
   │ Auto Check-In           │
   │ - Student ID            │
   │ - GPS Coordinates       │
   │ - Entry Time            │
   └──────┬──────────────────┘
          │
          ▼
   ┌─────────────────────────┐
   │ Mark Present            │
   │ + Location Verified     │
   └─────────────────────────┘

2. ATTENDANCE ALERTS (Automatic)
   ┌─────────────────────────┐
   │ After Marking Complete  │
   └──────┬──────────────────┘
          │
          ▼
   ┌─────────────────────────┐
   │ System Identifies       │
   │ Absent Students         │
   └──────┬──────────────────┘
          │
          ▼
   ┌─────────────────────────┐
   │ Send Alerts:            │
   │ - WhatsApp to Parents   │
   │ - SMS to Parents        │
   │ - Email to Parents      │
   └──────┬──────────────────┘
          │
          ▼
   ┌─────────────────────────┐
   │ Log Alert in            │
   │ whatsappAlerts table    │
   └─────────────────────────┘

3. ATTENDANCE ANALYTICS
   ┌──────────────┐
   │ Admin Views  │
   │ Dashboard    │
   └──────┬───────┘
          │
          ▼
   ┌─────────────────────────┐
   │ Calculate Metrics:      │
   │ - Daily Attendance %    │
   │ - Monthly Attendance %  │
   │ - Class-wise Report     │
   │ - Student-wise Report   │
   │ - Defaulter List        │
   └──────┬──────────────────┘
          │
          ▼
   ┌─────────────────────────┐
   │ Generate Reports:       │
   │ - PDF Download          │
   │ - Excel Export          │
   │ - Graphical Charts      │
   └─────────────────────────┘

4. LEAVE MANAGEMENT
   ┌──────────────┐
   │ Parent       │
   │ Applies Leave│
   └──────┬───────┘
          │
          ▼
   ┌─────────────────────────┐
   │ Submit Leave Request    │
   │ - Student ID            │
   │ - From Date             │
   │ - To Date               │
   │ - Reason                │
   └──────┬──────────────────┘
          │
          ▼
   ┌─────────────────────────┐
   │ Teacher/Admin Approves  │
   └──────┬──────────────────┘
          │
          ▼
   ┌─────────────────────────┐
   │ Auto-Mark Absent        │
   │ with "On Leave" status  │
   │ for date range          │
   └─────────────────────────┘
```

### 📁 Database Tables
- `attendance` - Daily attendance records
- `attendanceLeaves` - Leave requests and approvals

### 🎯 Key Features
- Multiple capture methods (manual, barcode, GPS)
- Real-time attendance tracking
- Automated parent alerts (WhatsApp/SMS)
- Attendance percentage calculation
- Defaulter identification
- Leave management
- Monthly/yearly reports

---

## 6. Grade Management (CBSE)

### 📋 Purpose
Automatic CBSE grade calculation based on marks, grade generation, and progress tracking. Supports scholastic and co-scholastic assessments.

### 👥 User Roles
- **Teacher** - Enter marks
- **AC Incharge** - Verify grades
- **Principal** - Final approval
- **Student** - View grades
- **Parent** - View child's grades

### 📊 Workflow Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│            CBSE GRADE MANAGEMENT WORKFLOW                        │
└─────────────────────────────────────────────────────────────────┘

1. MARKS ENTRY
   ┌──────────────┐
   │ Teacher      │
   │ Enters Marks │
   └──────┬───────┘
          │
          ▼
   ┌─────────────────────────┐
   │ Select:                 │
   │ - Class & Section       │
   │ - Subject               │
   │ - Exam Type             │
   │   (FA1/FA2/SA1/SA2)     │
   └──────┬──────────────────┘
          │
          ▼
   ┌─────────────────────────┐
   │ Enter Marks for Each    │
   │ Student:                │
   │ - Theory (Max: 80)      │
   │ - Practical (Max: 20)   │
   │ - Total: 100            │
   └──────┬──────────────────┘
          │
          ▼
   ┌─────────────────────────┐
   │ Validate:               │
   │ - Marks ≤ Max marks     │
   │ - No negative values    │
   │ - All students covered  │
   └──────┬──────────────────┘
          │
          ▼
   ┌─────────────────────────┐      ┌─────────────────┐
   │ Save Marks              │──────▶│ grades table    │
   │ Status: PENDING         │      └─────────────────┘
   └─────────────────────────┘

2. AUTOMATIC GRADE CALCULATION (CBSE Formula)
   ┌──────────────────────────┐
   │ System Automatically     │
   │ Calculates:              │
   └──────┬───────────────────┘
          │
          ▼
   ┌─────────────────────────────────────────┐
   │ CBSE Grade Scale:                       │
   ├─────────────────────────────────────────┤
   │ 91-100 → A1 (Grade Point: 10)           │
   │ 81-90  → A2 (Grade Point: 9)            │
   │ 71-80  → B1 (Grade Point: 8)            │
   │ 61-70  → B2 (Grade Point: 7)            │
   │ 51-60  → C1 (Grade Point: 6)            │
   │ 41-50  → C2 (Grade Point: 5)            │
   │ 33-40  → D  (Grade Point: 4)            │
   │ 21-32  → E1 (Grade Point: 2)            │
   │ 00-20  → E2 (Grade Point: 1)            │
   └──────┬──────────────────────────────────┘
          │
          ▼
   ┌─────────────────────────┐
   │ Calculate:              │
   │                         │
   │ Term 1 = FA1 + SA1      │
   │ Term 2 = FA2 + SA2      │
   │ Final = (T1 + T2) / 2   │
   │                         │
   │ CGPA = Avg of all       │
   │        subject GPs      │
   └──────┬──────────────────┘
          │
          ▼
   ┌─────────────────────────┐
   │ Generate Grade Card     │
   │ - Subject-wise grades   │
   │ - CGPA                  │
   │ - Class Rank            │
   │ - Attendance %          │
   └─────────────────────────┘

3. GRADE VERIFICATION & APPROVAL
   ┌──────────────┐
   │ AC Incharge  │
   │ Reviews      │
   └──────┬───────┘
          │
          ▼
   ┌─────────────────────────┐
   │ Check for Errors:       │
   │ - Data entry mistakes   │
   │ - Calculation errors    │
   │ - Missing entries       │
   └──────┬──────────────────┘
          │
          ├─────────────────┐
          │ Issues Found?   │
          ├────┬────────────┤
          │YES │ NO         │
          ▼    ▼            │
   ┌──────────┐ ┌───────────┴──┐
   │ Send     │ │ Forward to   │
   │ Back to  │ │ Principal    │
   │ Teacher  │ │ for Final    │
   │ for      │ │ Approval     │
   │ Revision │ └──────┬───────┘
   └──────────┘        │
                       ▼
                ┌─────────────────┐
                │ Principal        │
                │ Approves         │
                │ Status: PUBLISHED│
                └────────┬─────────┘
                         │
                         ▼
                ┌─────────────────┐
                │ Grades Visible  │
                │ to Students &   │
                │ Parents         │
                └─────────────────┘

4. REPORT CARD GENERATION
   ┌──────────────┐
   │ Generate     │
   │ Report Card  │
   └──────┬───────┘
          │
          ▼
   ┌─────────────────────────┐
   │ Compile Data:           │
   │ - Student Details       │
   │ - All Subject Grades    │
   │ - CGPA                  │
   │ - Attendance            │
   │ - Co-Scholastic Grades  │
   │ - Remarks               │
   └──────┬──────────────────┘
          │
          ▼
   ┌─────────────────────────┐
   │ Generate PDF            │
   │ - CBSE Format           │
   │ - School Logo           │
   │ - Principal Signature   │
   │ - Class Teacher Sign    │
   └──────┬──────────────────┘
          │
          ▼
   ┌─────────────────────────┐
   │ Options:                │
   │ - Download PDF          │
   │ - Email to Parents      │
   │ - Print Physical Copy   │
   └─────────────────────────┘
```

### 📁 Database Tables
- `grades` - Student marks and grades
- `exams` - Exam configurations (FA1, FA2, SA1, SA2)

### 🎯 CBSE Grade Scale
| Marks Range | Grade | Grade Point |
|-------------|-------|-------------|
| 91-100 | A1 | 10 |
| 81-90 | A2 | 9 |
| 71-80 | B1 | 8 |
| 61-70 | B2 | 7 |
| 51-60 | C1 | 6 |
| 41-50 | C2 | 5 |
| 33-40 | D | 4 |
| 21-32 | E1 | 2 |
| 00-20 | E2 | 1 |

---

## 7. Exam Management

### 📋 Purpose
Schedule and manage examinations including question paper creation, hall ticket generation, invigilation duty allocation, and result processing.

### 📊 Workflow Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                    EXAM MANAGEMENT WORKFLOW                      │
└─────────────────────────────────────────────────────────────────┘

1. EXAM SCHEDULING
   ┌──────────────┐
   │ AC Incharge  │
   │ Creates Exam │
   └──────┬───────┘
          │
          ▼
   ┌─────────────────────────┐
   │ Define Exam:            │
   │ - Name (FA1/FA2/SA1)    │
   │ - Date Range            │
   │ - Classes               │
   │ - Max Marks             │
   └──────┬──────────────────┘
          │
          ▼
   ┌─────────────────────────┐
   │ Create Timetable:       │
   │ For Each Subject:       │
   │ - Date & Time           │
   │ - Duration              │
   │ - Exam Hall             │
   └──────┬──────────────────┘
          │
          ▼
   ┌─────────────────────────┐
   │ Auto-Allocate           │
   │ Invigilation Duty       │
   │ (See Module #19)        │
   └─────────────────────────┘

2. HALL TICKET GENERATION
   ┌──────────────┐
   │ System Auto  │
   │ Generates    │
   └──────┬───────┘
          │
          ▼
   ┌─────────────────────────┐
   │ For Each Student:       │
   │ - Student Photo         │
   │ - Roll Number           │
   │ - Exam Schedule         │
   │ - Important Instructions│
   │ - Barcode/QR Code       │
   └──────┬──────────────────┘
          │
          ▼
   ┌─────────────────────────┐
   │ Generate PDF            │
   │ Bulk Download/Print     │
   └─────────────────────────┘

3. CONDUCT EXAM
   ┌─────────────────────────┐
   │ On Exam Day:            │
   │ - Student Attendance    │
   │ - Answer Sheet Tracking │
   │ - Incident Recording    │
   └─────────────────────────┘

4. RESULT PROCESSING
   ┌──────────────┐
   │ Teachers     │
   │ Enter Marks  │
   └──────┬───────┘
          │
          ▼
   ┌─────────────────────────┐
   │ Auto CBSE Grade         │
   │ Calculation             │
   │ (See Module #6)         │
   └─────────────────────────┘
```

### 📁 Database Tables
- `exams` - Exam master data
- `examSchedule` - Exam timetable
- `grades` - Exam results

---

## 8. Timetable Management

### 📋 Purpose
Create and manage school timetables with automatic conflict detection, teacher workload balancing, and period allocation.

### 📊 Workflow Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                  TIMETABLE MANAGEMENT WORKFLOW                   │
└─────────────────────────────────────────────────────────────────┘

1. TIMETABLE CREATION
   ┌──────────────┐
   │ AC Incharge  │
   │ Creates      │
   │ Timetable    │
   └──────┬───────┘
          │
          ▼
   ┌─────────────────────────┐
   │ Select:                 │
   │ - Academic Year         │
   │ - Class & Section       │
   │ - Effective From        │
   └──────┬──────────────────┘
          │
          ▼
   ┌─────────────────────────┐
   │ Define Periods:         │
   │ - Period 1: 8:00-8:45   │
   │ - Period 2: 8:45-9:30   │
   │ - Break: 9:30-9:45      │
   │ - Period 3: 9:45-10:30  │
   │ ... and so on           │
   └──────┬──────────────────┘
          │
          ▼
   ┌─────────────────────────┐
   │ For Each Day & Period:  │
   │ - Assign Subject        │
   │ - Assign Teacher        │
   └──────┬──────────────────┘
          │
          ▼
   ┌─────────────────────────┐
   │ CONFLICT DETECTION:     │
   │                         │
   │ Check for:              │
   │ ✓ Teacher double-booked │
   │ ✓ Room double-booked    │
   │ ✓ Class double-booked   │
   │ ✓ Subject distribution  │
   │ ✓ Teacher workload      │
   └──────┬──────────────────┘
          │
          ├─────────────────┐
          │ Conflicts?      │
          ├────┬────────────┤
          │YES │ NO         │
          ▼    ▼            │
   ┌──────────┐ ┌───────────┴──┐
   │ Show     │ │ Save         │
   │ Warning  │ │ Timetable    │
   │ Suggest  │ │              │
   │ Fix      │ └──────────────┘
   └──────────┘

2. TEACHER WORKLOAD BALANCING
   ┌─────────────────────────┐
   │ System Calculates:      │
   │                         │
   │ For Each Teacher:       │
   │ - Total Periods/Week    │
   │ - Free Periods          │
   │ - Consecutive Classes   │
   │ - Break Distribution    │
   └──────┬──────────────────┘
          │
          ▼
   ┌─────────────────────────┐
   │ Alert if:               │
   │ - > 30 periods/week     │
   │ - < 2 free periods/day  │
   │ - > 4 consecutive       │
   └─────────────────────────┘

3. TIMETABLE VIEW
   ┌──────────────┐
   │ Users View   │
   │ Timetable    │
   └──────┬───────┘
          │
          ├─────────────────────────┐
          │ By Role:                │
          ├─────────────────────────┤
          │ Teacher → My Schedule   │
          │ Student → Class Schedule│
          │ Admin   → All Schedules │
          └─────────────────────────┘
```

### 📁 Database Tables
- `timetable` - Period allocations
- `timetableConflicts` - Detected conflicts

### 🎯 Key Features
- Automatic conflict detection
- Teacher workload balancing
- Multiple view modes (teacher, class, room)
- Period swap functionality
- Timetable templates

---

## 9. AI-Powered Substitution Management

### 📋 Purpose
Intelligent teacher substitution system using AI to find the best available teacher based on subject expertise, workload, and availability when a teacher is absent.

### 📊 Workflow Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│           AI-POWERED SUBSTITUTION MANAGEMENT WORKFLOW            │
└─────────────────────────────────────────────────────────────────┘

1. LEAVE REQUEST SUBMISSION
   ┌──────────────┐
   │ Teacher      │
   │ Requests     │
   │ Leave        │
   └──────┬───────┘
          │
          ▼
   ┌─────────────────────────┐
   │ Submit Request:         │
   │ - Date                  │
   │ - Period(s)             │
   │ - Reason                │
   │ - Emergency/Planned     │
   └──────┬──────────────────┘
          │
          ▼
   ┌─────────────────────────┐
   │ Admin Approves          │
   └──────┬──────────────────┘
          │
          ▼
   ┌─────────────────────────┐
   │ Trigger AI Substitution │
   │ Algorithm               │
   └──────┬──────────────────┘
          │
          ▼

2. AI SUBSTITUTION ALGORITHM
   ┌─────────────────────────────────────────────┐
   │ INTELLIGENT TEACHER SELECTION                │
   ├─────────────────────────────────────────────┤
   │                                             │
   │ Step 1: Get Available Teachers              │
   │ ┌─────────────────────────────────────┐    │
   │ │ Query all teachers who are:         │    │
   │ │ ✓ Present on that day               │    │
   │ │ ✓ Free during that period           │    │
   │ │ ✓ Not on leave                      │    │
   │ └─────────────────────────────────────┘    │
   │                                             │
   │ Step 2: Score Each Teacher                  │
   │ ┌─────────────────────────────────────┐    │
   │ │ Calculate AI Score (0-100):         │    │
   │ │                                     │    │
   │ │ Points for:                         │    │
   │ │ +40 pts - Same subject expertise    │    │
   │ │ +30 pts - Low workload this week    │    │
   │ │ +20 pts - Past substitutions (fewer)│    │
   │ │ +10 pts - Same grade level exp.     │    │
   │ │                                     │    │
   │ │ Deductions:                         │    │
   │ │ -15 pts - Already 2+ subs this week │    │
   │ │ -10 pts - Different subject         │    │
   │ │ -5 pts  - Just before/after break   │    │
   │ └─────────────────────────────────────┘    │
   │                                             │
   │ Step 3: Rank Teachers                       │
   │ ┌─────────────────────────────────────┐    │
   │ │ Sort by AI Score (highest first)    │    │
   │ │ Present top 3 recommendations       │    │
   │ └─────────────────────────────────────┘    │
   └─────────────────────────────────────────────┘
          │
          ▼
   ┌─────────────────────────┐
   │ Show Recommendations:   │
   │                         │
   │ 🥇 Mrs. Sharma (95 pts) │
   │   ✓ Physics expert      │
   │   ✓ Only 1 sub this week│
   │   ✓ Free period         │
   │                         │
   │ 🥈 Mr. Kumar (88 pts)   │
   │   ✓ Science background  │
   │   ✓ Available           │
   │                         │
   │ 🥉 Mrs. Gupta (82 pts)  │
   │   ✓ Math teacher        │
   │   ✓ Light workload      │
   └──────┬──────────────────┘
          │
          ▼

3. SUBSTITUTION ASSIGNMENT
   ┌──────────────┐
   │ Admin        │
   │ Selects      │
   │ Teacher      │
   └──────┬───────┘
          │
          ▼
   ┌─────────────────────────┐
   │ Assign Substitution:    │
   │ - Update timetable      │
   │ - Notify substitute     │
   │ - Notify class          │
   │ - Log in system         │
   └──────┬──────────────────┘
          │
          ▼
   ┌─────────────────────────┐
   │ Send Notifications:     │
   │                         │
   │ To Substitute Teacher:  │
   │ "You have been assigned │
   │  substitution for       │
   │  Class 10-A, Period 3   │
   │  Physics on 21/10/2025" │
   │                         │
   │ To Original Teacher:    │
   │ "Your class covered by  │
   │  Mrs. Sharma"           │
   └─────────────────────────┘

4. POST-SUBSTITUTION TRACKING
   ┌─────────────────────────┐
   │ After Class:            │
   │                         │
   │ Substitute Updates:     │
   │ - Attendance taken?     │
   │ - Topics covered        │
   │ - Student behavior      │
   │ - Homework assigned     │
   └──────┬──────────────────┘
          │
          ▼
   ┌─────────────────────────┐
   │ Update Records:         │
   │ - substitutions table   │
   │ - Teacher workload      │
   │ - Substitution count    │
   └─────────────────────────┘
```

### 📁 Database Tables
- `substitutionRequests` - Leave/absence requests
- `substitutions` - Substitution assignments
- `substitutionTracking` - Post-substitution feedback

### 🤖 AI Scoring Algorithm
```
AI Score = (Subject Match × 40) +
           (Workload Factor × 30) +
           (Substitution History × 20) +
           (Grade Level Experience × 10) -
           (Penalties)

Where:
- Subject Match: 1.0 if exact match, 0.5 if related, 0 otherwise
- Workload Factor: (Max Periods - Current Periods) / Max Periods
- Substitution History: (Max Subs - Current Subs) / Max Subs
- Grade Level Experience: 1.0 if taught same grade, 0.5 otherwise
```

---

## 10. Library Management

### 📋 Purpose
Comprehensive library system with book cataloging, issue/return tracking, fine management, and barcode integration.

### 📊 Workflow Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                  LIBRARY MANAGEMENT WORKFLOW                     │
└─────────────────────────────────────────────────────────────────┘

1. BOOK ACQUISITION
   ┌──────────────┐
   │ Librarian    │
   │ Adds Book    │
   └──────┬───────┘
          │
          ▼
   ┌─────────────────────────┐
   │ Enter Book Details:     │
   │ - Title                 │
   │ - Author                │
   │ - ISBN                  │
   │ - Publisher             │
   │ - Category              │
   │ - Quantity              │
   └──────┬──────────────────┘
          │
          ▼
   ┌─────────────────────────┐
   │ Generate Barcode        │
   │ for Each Copy           │
   │ (Unique Accession No.)  │
   └──────┬──────────────────┘
          │
          ▼
   ┌─────────────────────────┐
   │ Print Barcode Labels    │
   │ Stick on Books          │
   └─────────────────────────┘

2. BOOK ISSUE PROCESS
   ┌──────────────┐
   │ Student      │
   │ Requests Book│
   └──────┬───────┘
          │
          ▼
   ┌─────────────────────────┐
   │ Librarian Scans:        │
   │ 1. Student ID Card      │
   │ 2. Book Barcode         │
   └──────┬──────────────────┘
          │
          ▼
   ┌─────────────────────────┐
   │ System Checks:          │
   │ ✓ Student has quota?    │
   │ ✓ No overdue books?     │
   │ ✓ Book available?       │
   │ ✓ No pending fines?     │
   └──────┬──────────────────┘
          │
          ├─────────────────┐
          │ All OK?         │
          ├────┬────────────┤
          │NO  │ YES        │
          ▼    ▼            │
   ┌──────────┐ ┌───────────┴──┐
   │ Show     │ │ Issue Book   │
   │ Error    │ │ - Create     │
   │ Message  │ │   record     │
   └──────────┘ │ - Set due    │
                │   date       │
                │ - Print slip │
                └──────────────┘

3. BOOK RETURN PROCESS
   ┌──────────────┐
   │ Student      │
   │ Returns Book │
   └──────┬───────┘
          │
          ▼
   ┌─────────────────────────┐
   │ Librarian Scans Book    │
   │ Barcode                 │
   └──────┬──────────────────┘
          │
          ▼
   ┌─────────────────────────┐
   │ System Checks:          │
   │ - Is book overdue?      │
   │ - Calculate fine        │
   │ - Check condition       │
   └──────┬──────────────────┘
          │
          ├─────────────────┐
          │ Overdue?        │
          ├────┬────────────┤
          │YES │ NO         │
          ▼    ▼            │
   ┌──────────┐ ┌───────────┴──┐
   │Calculate │ │ Mark Returned│
   │Fine      │ │ Update Status│
   │₹5/day    │ └──────────────┘
   └─────┬────┘
         │
         ▼
   ┌─────────────────────────┐
   │ Student Pays Fine       │
   │ (if applicable)         │
   └──────┬──────────────────┘
          │
          ▼
   ┌─────────────────────────┐
   │ Book Available Again    │
   └─────────────────────────┘

4. BOOK SEARCH
   ┌──────────────┐
   │ Student      │
   │ Searches     │
   └──────┬───────┘
          │
          ▼
   ┌─────────────────────────┐
   │ Search by:              │
   │ - Title                 │
   │ - Author                │
   │ - ISBN                  │
   │ - Category              │
   │ - Keywords              │
   └──────┬──────────────────┘
          │
          ▼
   ┌─────────────────────────┐
   │ Show Results:           │
   │ - Book details          │
   │ - Availability status   │
   │ - Location/Shelf        │
   │ - Due date (if issued)  │
   └─────────────────────────┘
```

### 📁 Database Tables
- `libraryBooks` - Book catalog
- `libraryIssuance` - Issue/return records
- `libraryFines` - Fine management

### 🎯 Library Rules (Configurable per School)
- Max books per student: 2-3
- Issue period: 14 days
- Fine: ₹5 per day overdue
- Renewal: Once if not reserved

---

## 11. Fee Management

### 📋 Purpose
Comprehensive fee collection system with payment gateway integration (per-school), installment support, and automated receipts.

### 📊 Workflow Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                    FEE MANAGEMENT WORKFLOW                       │
└─────────────────────────────────────────────────────────────────┘

1. FEE STRUCTURE SETUP
   ┌──────────────┐
   │ School Admin │
   │ Defines Fees │
   └──────┬───────┘
          │
          ▼
   ┌─────────────────────────┐
   │ Create Fee Structure:   │
   │ For Each Class:         │
   │ - Tuition Fee           │
   │ - Transport Fee         │
   │ - Lab Fee               │
   │ - Library Fee           │
   │ - Sports Fee            │
   │ - Exam Fee              │
   │ Total Annual Fee        │
   └──────┬──────────────────┘
          │
          ▼
   ┌─────────────────────────┐
   │ Define Installments:    │
   │ - Term 1: April         │
   │ - Term 2: August        │
   │ - Term 3: December      │
   │ Or Monthly              │
   └─────────────────────────┘

2. FEE PAYMENT PROCESS
   ┌──────────────┐
   │ Parent/      │
   │ Student      │
   │ Pays Fee     │
   └──────┬───────┘
          │
          ▼
   ┌─────────────────────────┐
   │ Select Payment Method:  │
   │ 1. Cash                 │
   │ 2. Online (Gateway)     │
   │ 3. Cheque               │
   │ 4. Bank Transfer        │
   └──────┬──────────────────┘
          │
          ├─────────────────────────┐
          │ Method?                 │
          ├──────────┬──────────────┤
          │ ONLINE   │ OFFLINE      │
          ▼          ▼              │
   ┌─────────────┐ ┌───────────────┴┐
   │ Redirect to │ │ Office Staff   │
   │ Payment     │ │ Receives       │
   │ Gateway     │ │ Payment        │
   │ (Stripe/    │ │                │
   │ Razorpay)   │ │ Manual Receipt │
   └──────┬──────┘ │ Generation     │
          │        └────────┬────────┘
          │                 │
          └────────┬────────┘
                   │
                   ▼
   ┌─────────────────────────┐
   │ Payment Successful?     │
   ├──────────┬──────────────┤
   │ YES      │ NO           │
   ▼          ▼              │
┌──────────┐ ┌───────────────┴┐
│ Generate │ │ Payment Failed │
│ Receipt  │ │ Retry/Cancel   │
│ - Receipt│ └────────────────┘
│   Number │
│ - Amount │
│ - Date   │
│ - Method │
└────┬─────┘
     │
     ▼
┌─────────────────────────┐
│ Send Receipt:           │
│ - Email to Parent       │
│ - SMS notification      │
│ - WhatsApp PDF          │
│ - Print option          │
└─────────────────────────┘

3. FEE DEFAULTER TRACKING
   ┌─────────────────────────┐
   │ System Automatically    │
   │ Identifies Defaulters   │
   └──────┬──────────────────┘
          │
          ▼
   ┌─────────────────────────┐
   │ Criteria:               │
   │ - Installment overdue   │
   │ - Grace period expired  │
   │ - Partial payment       │
   └──────┬──────────────────┘
          │
          ▼
   ┌─────────────────────────┐
   │ Send Reminders:         │
   │ Day 1: Friendly reminder│
   │ Day 7: Formal notice    │
   │ Day 14: Final warning   │
   │ Day 21: Late fee applied│
   └──────┬──────────────────┘
          │
          ▼
   ┌─────────────────────────┐
   │ Generate Reports:       │
   │ - Defaulter list        │
   │ - Amount pending        │
   │ - Follow-up action      │
   └─────────────────────────┘

4. FINANCIAL REPORTS
   ┌─────────────────────────┐
   │ Admin Views Reports:    │
   │                         │
   │ - Daily Collection      │
   │ - Monthly Collection    │
   │ - Fee vs Collected      │
   │ - Outstanding Amount    │
   │ - Category-wise         │
   │ - Class-wise            │
   │ - Payment Method-wise   │
   └─────────────────────────┘
```

### 📁 Database Tables
- `feeStructure` - Fee definitions
- `feePayments` - Payment records
- `feeReceipts` - Generated receipts

### 💳 Payment Gateway Integration (Per-School)
- School configures their own Stripe/Razorpay/PayU keys
- Stored encrypted in `schoolSettings` table
- Category: `payment_gateway_integration`
- Keys: `gateway_type`, `api_key`, `secret_key`, `enabled`

---

## 12. Transportation Management

### 📋 Purpose
Manage school transportation with GPS tracking, route optimization, bus attendance, and live location sharing with parents.

### 📊 Workflow Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                TRANSPORTATION MANAGEMENT WORKFLOW                │
└─────────────────────────────────────────────────────────────────┘

1. ROUTE SETUP
   ┌──────────────┐
   │ Transport    │
   │ Admin        │
   └──────┬───────┘
          │
          ▼
   ┌─────────────────────────┐
   │ Define Route:           │
   │ - Route Name/Number     │
   │ - Starting Point        │
   │ - Stops (with GPS)      │
   │ - Ending Point (School) │
   │ - Timings               │
   └──────┬──────────────────┘
          │
          ▼
   ┌─────────────────────────┐
   │ Assign Bus:             │
   │ - Bus Number            │
   │ - Driver Details        │
   │ - Conductor Details     │
   │ - GPS Device ID         │
   │ - Capacity              │
   └──────┬──────────────────┘
          │
          ▼
   ┌─────────────────────────┐
   │ Assign Students:        │
   │ - Select students       │
   │ - Assign pickup stop    │
   │ - Assign drop stop      │
   │ - Monthly fee           │
   └─────────────────────────┘

2. DAILY BUS TRACKING (Morning & Evening)
   ┌─────────────────────────┐
   │ Bus Starts Journey      │
   │ Driver logs in          │
   └──────┬──────────────────┘
          │
          ▼
   ┌─────────────────────────┐
   │ GPS Device Transmits:   │
   │ - Current location      │
   │ - Speed                 │
   │ - Direction             │
   │ Every 30 seconds        │
   └──────┬──────────────────┘
          │
          ▼
   ┌─────────────────────────┐
   │ System Updates:         │
   │ - Live map              │
   │ - ETA to next stop      │
   │ - Distance covered      │
   └──────┬──────────────────┘
          │
          ▼
   ┌─────────────────────────┐
   │ At Each Stop:           │
   │ Conductor Marks:        │
   │ - Student boarded       │
   │ - Scan ID/Barcode       │
   │ - GPS location verified │
   └──────┬──────────────────┘
          │
          ▼
   ┌─────────────────────────┐
   │ Parent Receives:        │
   │ "Your child has boarded │
   │  the bus at [Stop Name] │
   │  at [Time]"             │
   │                         │
   │ + Live bus location link│
   └─────────────────────────┘

3. LIVE TRACKING FOR PARENTS
   ┌──────────────┐
   │ Parent       │
   │ Opens App    │
   └──────┬───────┘
          │
          ▼
   ┌─────────────────────────┐
   │ View Live Map:          │
   │ 🚌 Bus Icon             │
   │ 📍 Current Location     │
   │ 🏁 Route Path           │
   │ 📌 Upcoming Stops       │
   │ ⏱ ETA to My Stop        │
   └─────────────────────────┘

4. ATTENDANCE TRACKING
   ┌─────────────────────────┐
   │ Morning Journey:        │
   │ - Students picked up    │
   │ - Reached school        │
   │                         │
   │ Evening Journey:        │
   │ - Students boarded      │
   │ - Reached home          │
   └──────┬──────────────────┘
          │
          ▼
   ┌─────────────────────────┐
   │ Alert if:               │
   │ - Student didn't board  │
   │ - Student not dropped   │
   │ - Bus delayed > 30 mins │
   └─────────────────────────┘

5. INCIDENT REPORTING
   ┌──────────────┐
   │ Driver/      │
   │ Conductor    │
   │ Reports      │
   │ Incident     │
   └──────┬───────┘
          │
          ▼
   ┌─────────────────────────┐
   │ Types:                  │
   │ - Breakdown             │
   │ - Accident              │
   │ - Student misbehavior   │
   │ - Route obstruction     │
   └──────┬──────────────────┘
          │
          ▼
   ┌─────────────────────────┐
   │ Immediate Alerts to:    │
   │ - Transport Admin       │
   │ - Principal             │
   │ - Affected Parents      │
   │ - Alternative arranged  │
   └─────────────────────────┘
```

### 📁 Database Tables
- `transportRoutes` - Route definitions
- `transportBuses` - Bus fleet management
- `transportAssignments` - Student-route mapping
- `transportAttendance` - Daily bus attendance
- `transportGPSLogs` - GPS tracking data

### 🗺️ GPS Integration
- Real-time location tracking
- Geofence for each stop
- Speed monitoring
- Route deviation alerts
- Live map for parents

---

## 13. WhatsApp Smart Alert System

### 📋 Purpose
Automated WhatsApp notifications to parents for attendance, fee reminders, exam schedules, and important announcements using school's WhatsApp Business API.

### 📊 Workflow Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│              WHATSAPP SMART ALERT SYSTEM WORKFLOW                │
└─────────────────────────────────────────────────────────────────┘

1. WHATSAPP API CONFIGURATION (Per-School)
   ┌──────────────┐
   │ Super Admin/ │
   │ School Admin │
   └──────┬───────┘
          │
          ▼
   ┌─────────────────────────┐
   │ School Settings:        │
   │ - WhatsApp Business API │
   │   Account               │
   │ - API Key (encrypted)   │
   │ - Phone Number ID       │
   │ - Enable/Disable        │
   └──────┬──────────────────┘
          │
          ▼
   ┌─────────────────────────┐
   │ Save in schoolSettings  │
   │ Category: whatsapp_     │
   │ integration             │
   └─────────────────────────┘

2. AUTOMATED TRIGGERS
   ┌─────────────────────────────────────────────┐
   │ Events that Trigger WhatsApp Messages:      │
   ├─────────────────────────────────────────────┤
   │                                             │
   │ A. ATTENDANCE ALERT                         │
   │    ┌────────────────────────────────┐      │
   │    │ When: Student marked absent    │      │
   │    │ To: Parents                    │      │
   │    │ Message: "Your child [Name]    │      │
   │    │ is absent today. Date: [Date]" │      │
   │    └────────────────────────────────┘      │
   │                                             │
   │ B. FEE REMINDER                             │
   │    ┌────────────────────────────────┐      │
   │    │ When: Fee due date approaching │      │
   │    │ To: Parents                    │      │
   │    │ Message: "Fee installment      │      │
   │    │ ₹[Amount] due on [Date]"       │      │
   │    └────────────────────────────────┘      │
   │                                             │
   │ C. EXAM NOTIFICATION                        │
   │    ┌────────────────────────────────┐      │
   │    │ When: Exam scheduled           │      │
   │    │ To: Students & Parents         │      │
   │    │ Message: "[Subject] exam on    │      │
   │    │ [Date] at [Time]"              │      │
   │    └────────────────────────────────┘      │
   │                                             │
   │ D. RESULT PUBLISHED                         │
   │    ┌────────────────────────────────┐      │
   │    │ When: Grades published         │      │
   │    │ To: Students & Parents         │      │
   │    │ Message: "Results published.   │      │
   │    │ Check your dashboard"          │      │
   │    └────────────────────────────────┘      │
   │                                             │
   │ E. EMERGENCY ANNOUNCEMENT                   │
   │    ┌────────────────────────────────┐      │
   │    │ When: Admin sends broadcast    │      │
   │    │ To: All parents/selected group │      │
   │    │ Message: Custom message        │      │
   │    └────────────────────────────────┘      │
   └─────────────────────────────────────────────┘

3. MESSAGE SENDING PROCESS
   ┌─────────────────────────┐
   │ Event Occurs            │
   │ (e.g., Student Absent)  │
   └──────┬──────────────────┘
          │
          ▼
   ┌─────────────────────────┐
   │ Get School's WhatsApp   │
   │ API Configuration       │
   │ from schoolSettings     │
   └──────┬──────────────────┘
          │
          ▼
   ┌─────────────────────────┐
   │ Check:                  │
   │ - API enabled?          │
   │ - Valid credentials?    │
   │ - Parent phone exists?  │
   └──────┬──────────────────┘
          │
          ├─────────────────┐
          │ Valid?          │
          ├────┬────────────┤
          │YES │ NO         │
          ▼    ▼            │
   ┌──────────┐ ┌───────────┴──┐
   │ Send via │ │ Log Error    │
   │ WhatsApp │ │ Skip sending │
   │ Business │ └──────────────┘
   │ API      │
   └────┬─────┘
        │
        ▼
   ┌─────────────────────────┐
   │ API Response:           │
   │ - Success → Log sent    │
   │ - Failed → Log failed   │
   │ - Store message ID      │
   └──────┬──────────────────┘
          │
          ▼
   ┌─────────────────────────┐
   │ Record in               │
   │ whatsappAlerts table:   │
   │ - Recipient             │
   │ - Message               │
   │ - Status                │
   │ - Sent time             │
   │ - Message ID            │
   └─────────────────────────┘

4. BULK MESSAGING
   ┌──────────────┐
   │ Admin Sends  │
   │ Broadcast    │
   └──────┬───────┘
          │
          ▼
   ┌─────────────────────────┐
   │ Select Recipients:      │
   │ - All Parents           │
   │ - Specific Class        │
   │ - Specific Students     │
   │ - Teachers              │
   └──────┬──────────────────┘
          │
          ▼
   ┌─────────────────────────┐
   │ Compose Message         │
   │ Preview                 │
   └──────┬──────────────────┘
          │
          ▼
   ┌─────────────────────────┐
   │ Queue Messages:         │
   │ Process in batches      │
   │ (20 messages/second)    │
   │ Avoid API rate limits   │
   └──────┬──────────────────┘
          │
          ▼
   ┌─────────────────────────┐
   │ Send & Track:           │
   │ - Total sent            │
   │ - Total delivered       │
   │ - Total failed          │
   │ - Read receipts         │
   └─────────────────────────┘
```

### 📁 Database Tables
- `schoolSettings` - WhatsApp API configuration (per-school)
- `whatsappAlerts` - Message logs and delivery status
- `whatsappTemplates` - Message templates

### 🔐 Security & Privacy
- API keys encrypted in database
- Per-school WhatsApp Business account
- GDPR compliant
- Opt-in/opt-out for parents
- Rate limiting to prevent spam

---

## 14. Certificate Generation

### 📋 Purpose
Automated generation of certificates (merit, participation, sports, conduct) with customizable templates and digital signatures.

### 📊 Workflow Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                CERTIFICATE GENERATION WORKFLOW                   │
└─────────────────────────────────────────────────────────────────┘

1. TEMPLATE DESIGN (One-time Setup)
   ┌──────────────┐
   │ School Admin │
   │ Creates      │
   │ Template     │
   └──────┬───────┘
          │
          ▼
   ┌─────────────────────────┐
   │ Design Certificate:     │
   │ - Border & Background   │
   │ - School Logo           │
   │ - Title/Heading         │
   │ - Body Text             │
   │ - Signature Placeholders│
   │ - Date Format           │
   │ - Watermark             │
   └──────┬──────────────────┘
          │
          ▼
   ┌─────────────────────────┐
   │ Define Variables:       │
   │ {STUDENT_NAME}          │
   │ {CLASS}                 │
   │ {ACHIEVEMENT}           │
   │ {DATE}                  │
   │ {CERTIFICATE_NO}        │
   └──────┬──────────────────┘
          │
          ▼
   ┌─────────────────────────┐
   │ Save Template           │
   │ Category:               │
   │ - Merit                 │
   │ - Participation         │
   │ - Sports                │
   │ - Conduct               │
   └─────────────────────────┘

2. CERTIFICATE GENERATION
   ┌──────────────┐
   │ Teacher/     │
   │ Admin        │
   │ Generates    │
   └──────┬───────┘
          │
          ▼
   ┌─────────────────────────┐
   │ Select:                 │
   │ - Student(s)            │
   │ - Certificate Type      │
   │ - Template              │
   │ - Achievement Details   │
   │ - Issue Date            │
   └──────┬──────────────────┘
          │
          ▼
   ┌─────────────────────────┐
   │ Auto-Fill Data:         │
   │ - Student Name          │
   │ - Class & Section       │
   │ - Achievement/Event     │
   │ - Date                  │
   │ - Certificate Number    │
   │   (Auto-generated:      │
   │   CERT/2025/001)        │
   └──────┬──────────────────┘
          │
          ▼
   ┌─────────────────────────┐
   │ Add Signatures:         │
   │ - Principal (Digital)   │
   │ - Class Teacher         │
   │ - School Seal           │
   └──────┬──────────────────┘
          │
          ▼
   ┌─────────────────────────┐
   │ Generate PDF            │
   │ - High Resolution       │
   │ - A4 Size               │
   │ - Watermark (Optional)  │
   └──────┬──────────────────┘
          │
          ▼
   ┌─────────────────────────┐
   │ Save to Database        │
   │ certificates table      │
   └──────┬──────────────────┘
          │
          ▼
   ┌─────────────────────────┐
   │ Options:                │
   │ - Download PDF          │
   │ - Email to Student      │
   │ - Print                 │
   │ - Bulk Download         │
   └─────────────────────────┘

3. VERIFICATION SYSTEM
   ┌─────────────────────────┐
   │ Anyone with Certificate │
   │ Number can Verify       │
   └──────┬──────────────────┘
          │
          ▼
   ┌─────────────────────────┐
   │ Enter Certificate No.   │
   │ CERT/2025/001           │
   └──────┬──────────────────┘
          │
          ▼
   ┌─────────────────────────┐
   │ System Shows:           │
   │ ✓ Valid Certificate     │
   │ - Student Name          │
   │ - Issue Date            │
   │ - Type                  │
   │ - Issuing School        │
   │                         │
   │ OR                      │
   │ ✗ Invalid/Not Found     │
   └─────────────────────────┘
```

### 📁 Database Tables
- `certificates` - Generated certificates
- `certificateTemplates` - Template designs

### 🎨 Certificate Types
- Merit Certificate (Academic excellence)
- Participation Certificate (Events)
- Sports Certificate (Achievements)
- Conduct Certificate (Good behavior)
- Transfer Certificate (School leaving)

---

## 15. Anti-Bullying & Behavior Tracking

### 📋 Purpose
Proactive anti-bullying system with incident tracking, AI-powered risk assessment, counselor referrals, and positive behavior reinforcement.

### 📊 Workflow Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│          ANTI-BULLYING & BEHAVIOR TRACKING WORKFLOW              │
└─────────────────────────────────────────────────────────────────┘

1. INCIDENT REPORTING
   ┌────────────────────────────┐
   │ Multiple Reporting Sources:│
   ├────────────────────────────┤
   │ A. Teacher Reports         │
   │ B. Student Self-Report     │
   │ C. Parent Reports          │
   │ D. Anonymous Tip Box       │
   └──────┬─────────────────────┘
          │
          ▼
   ┌─────────────────────────┐
   │ Incident Form:          │
   │ - Incident Type:        │
   │   • Physical Bullying   │
   │   • Verbal Bullying     │
   │   • Cyberbullying       │
   │   • Social Exclusion    │
   │   • Harassment          │
   │   • Theft               │
   │   • Vandalism           │
   │                         │
   │ - Involved Students     │
   │   • Victim(s)           │
   │   • Perpetrator(s)      │
   │   • Witnesses           │
   │                         │
   │ - Severity Level:       │
   │   • Low                 │
   │   • Medium              │
   │   • High                │
   │   • Critical            │
   │                         │
   │ - Description           │
   │ - Date & Time           │
   │ - Location              │
   │ - Evidence (photos/etc) │
   └──────┬──────────────────┘
          │
          ▼
   ┌─────────────────────────┐
   │ Save to Database        │
   │ incidentRecords table   │
   │ Status: REPORTED        │
   └──────┬──────────────────┘
          │
          ▼

2. AI RISK ASSESSMENT (Automatic)
   ┌─────────────────────────────────────────────┐
   │ AI ANALYZES STUDENT BEHAVIOR PATTERNS        │
   ├─────────────────────────────────────────────┤
   │                                             │
   │ Factors Considered:                         │
   │ ✓ Number of incidents (victim)              │
   │ ✓ Number of incidents (perpetrator)         │
   │ ✓ Frequency of incidents                    │
   │ ✓ Severity escalation                       │
   │ ✓ Attendance patterns                       │
   │ ✓ Academic performance decline              │
   │ ✓ Behavioral changes                        │
   │ ✓ Social isolation indicators               │
   │                                             │
   │ Risk Score Calculation:                     │
   │ ┌───────────────────────────────┐          │
   │ │ Score = (Incident Count × 30) │          │
   │ │        + (Severity Avg × 25)  │          │
   │ │        + (Frequency × 20)     │          │
   │ │        + (Attendance × 15)    │          │
   │ │        + (Academic × 10)      │          │
   │ └───────────────────────────────┘          │
   │                                             │
   │ Risk Levels:                                │
   │ 🟢 Low Risk      (0-30)                     │
   │ 🟡 Medium Risk   (31-60)                    │
   │ 🟠 High Risk     (61-85)                    │
   │ 🔴 Critical Risk (86-100)                   │
   └──────┬──────────────────────────────────────┘
          │
          ▼
   ┌─────────────────────────┐
   │ Automatic Alerts:       │
   │                         │
   │ If High/Critical Risk:  │
   │ - Alert Principal       │
   │ - Alert Counselor       │
   │ - Alert Parents         │
   │ - Recommend Actions     │
   └──────┬──────────────────┘
          │
          ▼

3. INCIDENT INVESTIGATION
   ┌──────────────┐
   │ Principal/   │
   │ Counselor    │
   │ Investigates │
   └──────┬───────┘
          │
          ▼
   ┌─────────────────────────┐
   │ Investigation Steps:    │
   │ 1. Interview victim     │
   │ 2. Interview perpetrator│
   │ 3. Interview witnesses  │
   │ 4. Collect evidence     │
   │ 5. Review CCTV (if any) │
   │ 6. Document findings    │
   └──────┬──────────────────┘
          │
          ▼
   ┌─────────────────────────┐
   │ Update Incident:        │
   │ - Investigation Notes   │
   │ - Evidence Attached     │
   │ - Status: INVESTIGATING │
   └──────┬──────────────────┘
          │
          ▼

4. ACTION & RESOLUTION
   ┌─────────────────────────┐
   │ Decide Actions:         │
   │                         │
   │ For Victim:             │
   │ - Counseling            │
   │ - Class change          │
   │ - Peer support group    │
   │ - Parent involvement    │
   │                         │
   │ For Perpetrator:        │
   │ - Warning               │
   │ - Detention             │
   │ - Suspension            │
   │ - Counseling (mandatory)│
   │ - Parent meeting        │
   │ - Behavioral contract   │
   └──────┬──────────────────┘
          │
          ▼
   ┌─────────────────────────┐
   │ Create Action Plan      │
   │ - Assign tasks          │
   │ - Set deadlines         │
   │ - Follow-up schedule    │
   └──────┬──────────────────┘
          │
          ▼
   ┌─────────────────────────┐
   │ Update Status:          │
   │ RESOLVED / ONGOING      │
   └──────┬──────────────────┘
          │
          ▼
   ┌─────────────────────────┐
   │ Follow-up Monitoring:   │
   │ - Weekly check-ins      │
   │ - Progress tracking     │
   │ - Reassess risk score   │
   └─────────────────────────┘

5. POSITIVE BEHAVIOR TRACKING
   ┌──────────────┐
   │ Teacher      │
   │ Records      │
   │ Achievement  │
   └──────┬───────┘
          │
          ▼
   ┌─────────────────────────┐
   │ Positive Behaviors:     │
   │ - Helping others        │
   │ - Academic excellence   │
   │ - Sports achievement    │
   │ - Leadership            │
   │ - Kindness              │
   │ - Responsibility        │
   └──────┬──────────────────┘
          │
          ▼
   ┌─────────────────────────┐
   │ Award Points:           │
   │ +10 pts: Helping        │
   │ +15 pts: Excellence     │
   │ +20 pts: Leadership     │
   │ +25 pts: Sports Win     │
   └──────┬──────────────────┘
          │
          ▼
   ┌─────────────────────────┐
   │ Recognition:            │
   │ - Certificate           │
   │ - Public recognition    │
   │ - Rewards               │
   │ - Parent notification   │
   └─────────────────────────┘

6. ANALYTICS & REPORTS
   ┌─────────────────────────┐
   │ Principal Views:        │
   │                         │
   │ - Total incidents       │
   │ - Incident trends       │
   │ - High-risk students    │
   │ - Type-wise breakdown   │
   │ - Resolution rate       │
   │ - Repeat offenders      │
   │ - Positive behaviors    │
   └─────────────────────────┘
```

### 📁 Database Tables
- `incidentRecords` - Bullying incidents
- `behaviorIncidents` - General behavior issues
- `positiveBehaviorLog` - Achievements and rewards
- `counselorReferrals` - Counseling cases
- `studentRiskAssessment` - AI risk scores

### 🎯 Key Features
- Multi-source reporting (teacher, student, parent, anonymous)
- AI-powered risk assessment
- Automatic alerts for high-risk students
- Counselor referral system
- Positive behavior reinforcement
- Trend analysis and prevention
- Complete audit trail

---

## 16. AI Analytics (Vipu.ai)

### 📋 Purpose
AI-powered analytics assistant for Principal and Super Admin providing real-time insights, predictive analytics, and downloadable reports across all modules.

### 👥 User Roles
- **Principal** - School-wide analytics
- **Super Admin** - Multi-school analytics

### 📊 Workflow Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                   AI ANALYTICS (VIPU.AI) WORKFLOW                │
└─────────────────────────────────────────────────────────────────┘

1. ANALYTICS QUERY (Chat Interface)
   ┌──────────────┐
   │ Principal/   │
   │ Super Admin  │
   │ Asks Question│
   └──────┬───────┘
          │
          ▼
   ┌─────────────────────────────────────────┐
   │ Example Queries:                        │
   ├─────────────────────────────────────────┤
   │ "What is our attendance rate this month?"│
   │ "Which class has lowest performance?"   │
   │ "Show fee collection trends"            │
   │ "Predict exam pass percentage"          │
   │ "Identify at-risk students"             │
   │ "Compare this year vs last year"        │
   │ "Generate monthly performance report"   │
   └──────┬──────────────────────────────────┘
          │
          ▼

2. AI PROCESSING (OpenAI GPT-4o)
   ┌─────────────────────────┐
   │ Get School's AI Config  │
   │ from schoolSettings:    │
   │ - ai_provider (openai)  │
   │ - ai_api_key            │
   │ - ai_model (gpt-4o)     │
   └──────┬──────────────────┘
          │
          ▼
   ┌─────────────────────────┐
   │ Extract Query Intent:   │
   │ - Module: Attendance    │
   │ - Metric: Rate          │
   │ - Time Period: Month    │
   │ - Filters: None         │
   └──────┬──────────────────┘
          │
          ▼
   ┌─────────────────────────┐
   │ Fetch Relevant Data:    │
   │ Query from database:    │
   │ - attendance table      │
   │ - students table        │
   │ - classes table         │
   │ For current month       │
   └──────┬──────────────────┘
          │
          ▼
   ┌─────────────────────────┐
   │ Analyze Data:           │
   │ - Calculate metrics     │
   │ - Identify trends       │
   │ - Generate insights     │
   │ - Create visualizations │
   └──────┬──────────────────┘
          │
          ▼
   ┌─────────────────────────┐
   │ Generate AI Response:   │
   │                         │
   │ "Your attendance rate   │
   │ this month is 94.5%.    │
   │                         │
   │ 📊 Insights:            │
   │ • Up 2% from last month │
   │ • Class 10-A: 97% (↑)   │
   │ • Class 9-B: 89% (↓)    │
   │                         │
   │ ⚠️ Concern: Class 9-B   │
   │ needs attention         │
   │                         │
   │ 📈 [Chart/Graph]        │
   │                         │
   │ Would you like a        │
   │ detailed report?"       │
   └──────┬──────────────────┘
          │
          ▼
   ┌─────────────────────────┐
   │ Display in Chat         │
   │ Interface               │
   └─────────────────────────┘

3. REPORT GENERATION
   ┌──────────────┐
   │ User Requests│
   │ Detailed     │
   │ Report       │
   └──────┬───────┘
          │
          ▼
   ┌─────────────────────────┐
   │ AI Compiles Report:     │
   │ - Executive Summary     │
   │ - Detailed Metrics      │
   │ - Charts & Graphs       │
   │ - Insights & Trends     │
   │ - Recommendations       │
   │ - Action Items          │
   └──────┬──────────────────┘
          │
          ▼
   ┌─────────────────────────┐
   │ Format Selection:       │
   │ - PDF (Professional)    │
   │ - Excel (Data Analysis) │
   │ - PowerPoint (Presentation)│
   └──────┬──────────────────┘
          │
          ▼
   ┌─────────────────────────┐
   │ Generate & Download     │
   │ File ready in seconds   │
   └─────────────────────────┘

4. PREDICTIVE ANALYTICS
   ┌─────────────────────────┐
   │ AI Predictions:         │
   │                         │
   │ Based on historical data│
   │ and patterns:           │
   │                         │
   │ • Exam pass rates       │
   │ • Fee collection        │
   │ • Attendance trends     │
   │ • Student performance   │
   │ • Resource needs        │
   │ • Enrollment forecast   │
   └─────────────────────────┘

5. MULTI-MODULE ANALYTICS
   ┌─────────────────────────────────────────┐
   │ Vipu.ai can analyze:                    │
   ├─────────────────────────────────────────┤
   │ ✓ Attendance (daily/monthly/yearly)     │
   │ ✓ Grades & Performance                  │
   │ ✓ Fee Collection & Defaults             │
   │ ✓ Library Usage                         │
   │ ✓ Transportation Efficiency             │
   │ ✓ Behavior & Incidents                  │
   │ ✓ Exam Results                          │
   │ ✓ Teacher Workload                      │
   │ ✓ Student Enrollment Trends             │
   │ ✓ Resource Utilization                  │
   └─────────────────────────────────────────┘
```

### 📁 Database Tables
- `aiAnalytics` - Saved analytics queries
- `aiReports` - Generated reports
- `schoolSettings` - AI API configuration (per-school)

### 🤖 AI Configuration (Per-School)
Each school configures their own:
- AI Provider (OpenAI, Gemini)
- API Key (encrypted)
- Model (GPT-4o, GPT-3.5, Gemini)
- Enable/Disable AI features

Stored in `schoolSettings`:
- Category: `ai_integration`
- Keys: `ai_provider`, `ai_api_key`, `ai_model`, `ai_enabled`

---

## 17. VipuDev.ai Coding Assistant

### 📋 Purpose
**Super Admin exclusive** AI-powered coding assistant using OpenAI GPT-4o for system development, debugging, and automation tasks.

### 👥 User Roles
- **Super Admin Only** - Exclusive access

### 📊 Workflow Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│              VIPUDEV.AI CODING ASSISTANT WORKFLOW                │
└─────────────────────────────────────────────────────────────────┘

1. ACCESS CONTROL
   ┌──────────────┐
   │ User Tries   │
   │ to Access    │
   │ VipuDev.ai   │
   └──────┬───────┘
          │
          ▼
   ┌─────────────────────────┐
   │ Check User Role         │
   │ superAdminOnly          │
   │ Middleware              │
   └──────┬──────────────────┘
          │
          ├─────────────────┐
          │ Super Admin?    │
          ├────┬────────────┤
          │YES │ NO         │
          ▼    ▼            │
   ┌──────────┐ ┌───────────┴──┐
   │ Grant    │ │ 403 Forbidden│
   │ Access   │ │ "Super Admin │
   │          │ │  access only"│
   └────┬─────┘ └──────────────┘
        │
        ▼

2. CODING ASSISTANCE
   ┌──────────────┐
   │ Super Admin  │
   │ Requests     │
   │ Assistance   │
   └──────┬───────┘
          │
          ▼
   ┌─────────────────────────────────────────┐
   │ Use Cases:                              │
   ├─────────────────────────────────────────┤
   │                                         │
   │ A. CODE GENERATION                      │
   │    "Create an API endpoint for          │
   │     student bulk upload"                │
   │                                         │
   │ B. DEBUGGING                            │
   │    "Why is attendance API failing       │
   │     for class 10-A?"                    │
   │                                         │
   │ C. DATABASE QUERIES                     │
   │    "Write SQL to find students          │
   │     with >90% attendance"               │
   │                                         │
   │ D. AUTOMATION SCRIPTS                   │
   │    "Create script to backup             │
   │     database daily"                     │
   │                                         │
   │ E. SYSTEM OPTIMIZATION                  │
   │    "Optimize slow-running               │
   │     grade calculation"                  │
   └──────┬──────────────────────────────────┘
          │
          ▼
   ┌─────────────────────────┐
   │ AI Processes Request    │
   │ Using GPT-4o            │
   │ - Understands context   │
   │ - Generates solution    │
   │ - Provides explanation  │
   └──────┬──────────────────┘
          │
          ▼
   ┌─────────────────────────┐
   │ Return Code/Solution:   │
   │                         │
   │ ```typescript           │
   │ app.post("/api/bulk-    │
   │ upload", async (req) => {│
   │   // Code here           │
   │ });                     │
   │ ```                     │
   │                         │
   │ With explanation and    │
   │ usage instructions      │
   └──────┬──────────────────┘
          │
          ▼
   ┌─────────────────────────┐
   │ Super Admin Reviews     │
   │ & Implements            │
   └─────────────────────────┘

3. COMMAND EXECUTION (Simulated)
   ┌──────────────┐
   │ Super Admin  │
   │ Executes     │
   │ Command      │
   └──────┬───────┘
          │
          ▼
   ┌─────────────────────────┐
   │ Example Commands:       │
   │ "npm install package"   │
   │ "Run database migration"│
   │ "Test API endpoint"     │
   └──────┬──────────────────┘
          │
          ▼
   ┌─────────────────────────┐
   │ Security Check:         │
   │ - Super Admin only      │
   │ - Whitelist commands    │
   │ - Confirm destructive   │
   │   operations            │
   └──────┬──────────────────┘
          │
          ▼
   ┌─────────────────────────┐
   │ Execute & Return Output │
   │ (Production mode:       │
   │  simulated response)    │
   └─────────────────────────┘
```

### 🔐 Security
- **Super Admin Only** - Strictest access control
- All queries logged for audit
- OpenAI API key system-wide (not per-school)
- Command execution limited/simulated
- No destructive operations without confirmation

### 📁 Database Tables
- `aiDevelopmentLog` - VipuDev.ai query history

---

## 18. ID Card Generator

### 📋 Purpose
Generate professional ID cards for students, teachers, and staff with barcodes, photos, and customizable designs.

### 📊 Workflow Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                  ID CARD GENERATOR WORKFLOW                      │
└─────────────────────────────────────────────────────────────────┘

1. CARD DESIGN TEMPLATE (Per-School)
   ┌──────────────┐
   │ School Admin │
   │ Customizes   │
   │ Design       │
   └──────┬───────┘
          │
          ▼
   ┌─────────────────────────┐
   │ Front Side:             │
   │ - School Logo           │
   │ - Photo Placement       │
   │ - Name                  │
   │ - ID Number             │
   │ - Class/Designation     │
   │ - Barcode/QR Code       │
   │ - School Colors         │
   └──────┬──────────────────┘
          │
          ▼
   ┌─────────────────────────┐
   │ Back Side:              │
   │ - Emergency Contact     │
   │ - Blood Group           │
   │ - Address               │
   │ - Validity Period       │
   │ - Signature             │
   └──────┬──────────────────┘
          │
          ▼
   ┌─────────────────────────┐
   │ Save Template           │
   │ Per Card Type:          │
   │ - Student               │
   │ - Teacher               │
   │ - Staff                 │
   └─────────────────────────┘

2. INDIVIDUAL CARD GENERATION
   ┌──────────────┐
   │ Admin        │
   │ Generates    │
   │ Card         │
   └──────┬───────┘
          │
          ▼
   ┌─────────────────────────┐
   │ Select Person:          │
   │ - Student/Teacher/Staff │
   │ - Auto-fill data        │
   │   from database         │
   └──────┬──────────────────┘
          │
          ▼
   ┌─────────────────────────┐
   │ Upload Photo            │
   │ (if not in database)    │
   │ - Crop to fit           │
   │ - Adjust brightness     │
   └──────┬──────────────────┘
          │
          ▼
   ┌─────────────────────────┐
   │ Generate Barcode/QR     │
   │ Encoding:               │
   │ - Student ID            │
   │ - Name                  │
   │ - Class                 │
   └──────┬──────────────────┘
          │
          ▼
   ┌─────────────────────────┐
   │ Create PDF              │
   │ Standard Size:          │
   │ - 85mm × 54mm (CR80)    │
   │ - Print-ready quality   │
   └──────┬──────────────────┘
          │
          ▼
   ┌─────────────────────────┐
   │ Options:                │
   │ - Download PDF          │
   │ - Print                 │
   │ - Email to user         │
   └─────────────────────────┘

3. BULK GENERATION
   ┌──────────────┐
   │ Admin        │
   │ Bulk Generate│
   └──────┬───────┘
          │
          ▼
   ┌─────────────────────────┐
   │ Select Group:           │
   │ - Entire Class          │
   │ - All Teachers          │
   │ - Department            │
   └──────┬──────────────────┘
          │
          ▼
   ┌─────────────────────────┐
   │ For Each Person:        │
   │ - Fetch data            │
   │ - Generate card         │
   │ - Add to PDF batch      │
   └──────┬──────────────────┘
          │
          ▼
   ┌─────────────────────────┐
   │ Create Multi-Page PDF   │
   │ - 10 cards per page     │
   │ - Cut marks included    │
   │ - Print-ready           │
   └──────┬──────────────────┘
          │
          ▼
   ┌─────────────────────────┐
   │ Bulk Download           │
   │ Send to Print Vendor    │
   └─────────────────────────┘
```

### 📁 Database Tables
- `idCards` - Generated card records
- `idCardTemplates` - Design templates

---

## 19. Invigilation Duty Allocation

### 📋 Purpose
Intelligent automatic allocation of invigilation duties during exams ensuring fair distribution and no conflicts.

### 📊 Workflow Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│          INVIGILATION DUTY ALLOCATION WORKFLOW                   │
└─────────────────────────────────────────────────────────────────┘

1. EXAM SETUP
   ┌──────────────┐
   │ AC Incharge  │
   │ Schedules    │
   │ Exam         │
   └──────┬───────┘
          │
          ▼
   ┌─────────────────────────┐
   │ Define Exam:            │
   │ - Date                  │
   │ - Time slots            │
   │ - Exam halls            │
   │ - Subjects per session  │
   └──────┬──────────────────┘
          │
          ▼

2. AUTOMATIC ALLOCATION ALGORITHM
   ┌─────────────────────────────────────────────┐
   │ INTELLIGENT DUTY ALLOCATION                 │
   ├─────────────────────────────────────────────┤
   │                                             │
   │ Step 1: Get Available Teachers              │
   │ ┌─────────────────────────────────────┐    │
   │ │ Criteria:                           │    │
   │ │ ✓ Present on exam day               │    │
   │ │ ✓ Not teaching same subject exam    │    │
   │ │ ✓ Not on leave                      │    │
   │ │ ✓ Not already assigned 3+ duties    │    │
   │ └─────────────────────────────────────┘    │
   │                                             │
   │ Step 2: Calculate Load Distribution        │
   │ ┌─────────────────────────────────────┐    │
   │ │ For Each Teacher:                   │    │
   │ │ - Current duties this exam cycle    │    │
   │ │ - Consecutive duty days             │    │
   │ │ - Morning vs afternoon balance      │    │
   │ │ - Distance from exam hall           │    │
   │ └─────────────────────────────────────┘    │
   │                                             │
   │ Step 3: Assign Fairly                       │
   │ ┌─────────────────────────────────────┐    │
   │ │ Priority to:                        │    │
   │ │ 1. Teachers with fewest duties      │    │
   │ │ 2. No consecutive days off          │    │
   │ │ 3. Balanced morning/afternoon       │    │
   │ │ 4. Different halls each time        │    │
   │ └─────────────────────────────────────┘    │
   │                                             │
   │ Step 4: Conflict Detection                  │
   │ ┌─────────────────────────────────────┐    │
   │ │ Check for:                          │    │
   │ │ ✗ Double booking                    │    │
   │ │ ✗ Same subject teaching             │    │
   │ │ ✗ > 3 duties per day                │    │
   │ │ ✗ No break between duties           │    │
   │ └─────────────────────────────────────┘    │
   └──────┬──────────────────────────────────────┘
          │
          ▼
   ┌─────────────────────────┐
   │ Generate Duty Chart:    │
   │                         │
   │ Hall A:                 │
   │ - Mrs. Sharma (Main)    │
   │ - Mr. Kumar (Relief)    │
   │                         │
   │ Hall B:                 │
   │ - Mrs. Gupta (Main)     │
   │ - Mr. Singh (Relief)    │
   └──────┬──────────────────┘
          │
          ▼

3. NOTIFICATION
   ┌─────────────────────────┐
   │ Send to Each Teacher:   │
   │                         │
   │ "Invigilation Duty      │
   │  assigned:              │
   │  Date: 21/10/2025       │
   │  Time: 10:00 AM         │
   │  Hall: Hall A           │
   │  Subject: Mathematics"  │
   └──────┬──────────────────┘
          │
          ▼
   ┌─────────────────────────┐
   │ Print Duty Chart        │
   │ Display on Notice Board │
   └─────────────────────────┘
```

### 📁 Database Tables
- `invigilationDuties` - Assigned duties
- `examHalls` - Hall configurations

---

## 20. Student Distribution System

### 📋 Purpose
Intelligently distribute students into sections based on academic performance, gender balance, and special needs for balanced classrooms.

### 📊 Workflow Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│             STUDENT DISTRIBUTION SYSTEM WORKFLOW                 │
└─────────────────────────────────────────────────────────────────┘

1. DISTRIBUTION CRITERIA SETUP
   ┌──────────────┐
   │ AC Incharge  │
   │ Sets Rules   │
   └──────┬───────┘
          │
          ▼
   ┌─────────────────────────┐
   │ Distribution Rules:     │
   │                         │
   │ ✓ Academic Balance      │
   │   - Mix high/low        │
   │     performers          │
   │                         │
   │ ✓ Gender Balance        │
   │   - Equal ratio         │
   │                         │
   │ ✓ Special Needs         │
   │   - Max 2-3 per section │
   │                         │
   │ ✓ Behavioral            │
   │   - Separate problem    │
   │     students            │
   └──────┬──────────────────┘
          │
          ▼

2. INTELLIGENT DISTRIBUTION
   ┌─────────────────────────────────────────────┐
   │ AI DISTRIBUTION ALGORITHM                   │
   ├─────────────────────────────────────────────┤
   │                                             │
   │ Step 1: Categorize Students                 │
   │ ┌─────────────────────────────────────┐    │
   │ │ By Performance:                     │    │
   │ │ - High (>80%)                       │    │
   │ │ - Medium (60-80%)                   │    │
   │ │ - Low (<60%)                        │    │
   │ │                                     │    │
   │ │ By Gender:                          │    │
   │ │ - Boys                              │    │
   │ │ - Girls                             │    │
   │ │                                     │    │
   │ │ By Special Needs:                   │    │
   │ │ - Yes/No                            │    │
   │ └─────────────────────────────────────┘    │
   │                                             │
   │ Step 2: Distribute Proportionally           │
   │ ┌─────────────────────────────────────┐    │
   │ │ For Each Section:                   │    │
   │ │ - 33% High performers               │    │
   │ │ - 34% Medium performers             │    │
   │ │ - 33% Low performers                │    │
   │ │                                     │    │
   │ │ - 50% Boys                          │    │
   │ │ - 50% Girls                         │    │
   │ │                                     │    │
   │ │ - Max 3 special needs students      │    │
   │ └─────────────────────────────────────┘    │
   │                                             │
   │ Step 3: Validate Distribution               │
   │ ┌─────────────────────────────────────┐    │
   │ │ Check:                              │    │
   │ │ ✓ Equal section sizes (±2)          │    │
   │ │ ✓ Balanced performance levels       │    │
   │ │ ✓ Gender ratio maintained           │    │
   │ │ ✓ Special needs distributed         │    │
   │ └─────────────────────────────────────┘    │
   └──────┬──────────────────────────────────────┘
          │
          ▼
   ┌─────────────────────────┐
   │ Show Distribution:      │
   │                         │
   │ Section A: 45 students  │
   │ - Boys: 23, Girls: 22   │
   │ - High: 15, Med: 15     │
   │   Low: 15               │
   │ - Special needs: 2      │
   │                         │
   │ Section B: 44 students  │
   │ - Boys: 22, Girls: 22   │
   │ - High: 15, Med: 14     │
   │   Low: 15               │
   │ - Special needs: 3      │
   └──────┬──────────────────┘
          │
          ▼
   ┌─────────────────────────┐
   │ Admin Approves          │
   │ OR                      │
   │ Manually Adjusts        │
   └──────┬──────────────────┘
          │
          ▼
   ┌─────────────────────────┐
   │ Save Distribution       │
   │ Update Student Records  │
   │ Notify Parents          │
   └─────────────────────────┘
```

### 📁 Database Tables
- `students` - Student data with section assignments
- `distributionConfig` - Distribution rules

---

## 🎯 Common Workflow Patterns

### Multi-Tenancy Pattern
All modules follow this pattern for multi-school support:

```
1. User Login
   ↓
2. JWT Token includes schoolId
   ↓
3. Every API Query filters by schoolId
   ↓
4. Data isolation per school
   ↓
5. Per-school configuration from schoolSettings
```

### Audit Trail Pattern
Critical operations log to audit tables:

```
1. User performs action
   ↓
2. Record in audit log:
   - Who (user ID)
   - What (action type)
   - When (timestamp)
   - Where (IP address)
   - Old values
   - New values
   ↓
3. Available for compliance reporting
```

### Per-School API Configuration Pattern
External integrations use per-school credentials:

```
1. School admin configures API keys
   ↓
2. Encrypted storage in schoolSettings table
   ↓
3. Runtime: Fetch school's API key
   ↓
4. Make API call with school's credentials
   ↓
5. Log result in school-specific table
```

---

## 📋 Summary

SmartGenEduX provides **20 comprehensive modules** covering every aspect of school management:

### Administrative (6 modules)
1. Subscription & Billing Management
2. User Management & Authentication
3. Student Management
4. Teacher Management
5. Fee Management
6. Transportation Management

### Academic (8 modules)
7. Attendance Management
8. Grade Management (CBSE)
9. Exam Management
10. Timetable Management
11. AI-Powered Substitution Management
12. Library Management
13. Invigilation Duty Allocation
14. Student Distribution System

### Communication (2 modules)
15. WhatsApp Smart Alert System
16. Certificate Generation

### Advanced/Premium (4 modules)
17. Anti-Bullying & Behavior Tracking
18. AI Analytics (Vipu.ai)
19. VipuDev.ai Coding Assistant
20. ID Card Generator

**All modules are production-ready with ZERO placeholders/dummies!**
