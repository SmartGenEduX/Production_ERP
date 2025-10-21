import { pgTable, text, varchar, uuid, timestamp, integer, boolean, decimal, jsonb, serial } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// User roles enum - 7 roles as per system requirement
export const userRoles = [
  'super_admin',
  'principal',
  'school_admin',
  'ac_incharge',
  'librarian',
  'teacher',
  'parent',
  'student'
] as const;
export type UserRole = typeof userRoles[number];

// School wings for wing-based school admins
export const schoolWings = ['KG', 'Primary', 'Middle', 'Secondary', 'Senior Secondary'] as const;
export type SchoolWing = typeof schoolWings[number];

// Schools table
export const schools = pgTable("schools", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: varchar("name", { length: 255 }).notNull(),
  latitude: varchar("latitude", { length: 50 }), // School location for GPS attendance
  longitude: varchar("longitude", { length: 50 }), // School location for GPS attendance
  address: text("address"),
  contactPhone: varchar("contact_phone", { length: 50 }),
  contactEmail: varchar("contact_email", { length: 255 }),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// User profiles table (connects to Supabase Auth)
export const userProfiles = pgTable("user_profiles", {
  id: uuid("id").primaryKey().defaultRandom(), // References auth.users(id) in Supabase
  schoolId: uuid("school_id").references(() => schools.id),
  role: text("role").notNull().$type<UserRole>(),
  wing: text("wing").$type<SchoolWing>(), // For school_admin role: KG, Primary, Middle, Secondary, Senior Secondary
  name: varchar("name", { length: 255 }), // Full name field
  firstName: varchar("first_name", { length: 100 }),
  lastName: varchar("last_name", { length: 100 }),
  email: varchar("email", { length: 255 }).unique(),
  password: varchar("password", { length: 255 }), // Hashed password using bcrypt
  phone: varchar("phone", { length: 20 }),
  address: text("address"),
  isActive: boolean("is_active").default(true),
  mustChangePassword: boolean("must_change_password").default(true), // Force password change on first login
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Teachers table
export const teachers = pgTable("teachers", {
  id: uuid("id").primaryKey().defaultRandom(),
  schoolId: uuid("school_id").notNull().references(() => schools.id),
  userProfileId: uuid("user_profile_id").notNull().references(() => userProfiles.id),
  teacherId: varchar("teacher_id", { length: 50 }).notNull(),
  employmentType: varchar("employment_type", { length: 20 }).default("full_time"), // full_time, part_time, contract
  department: varchar("department", { length: 100 }),
  subject: varchar("subject", { length: 100 }),
  monthlySalary: decimal("monthly_salary", { precision: 10, scale: 2 }),
  joiningDate: timestamp("joining_date"),
  qualification: varchar("qualification", { length: 255 }),
});

// Classes table
export const classes = pgTable("classes", {
  id: uuid("id").primaryKey().defaultRandom(),
  schoolId: uuid("school_id").notNull().references(() => schools.id),
  name: varchar("name", { length: 50 }).notNull(),
  section: varchar("section", { length: 10 }).notNull(),
  classTeacherProfileId: uuid("class_teacher_profile_id").references(() => userProfiles.id),
  academicYear: varchar("academic_year", { length: 10 }).notNull(),
});

// Students table
export const students = pgTable("students", {
  id: uuid("id").primaryKey().defaultRandom(),
  schoolId: uuid("school_id").notNull().references(() => schools.id),
  admissionNumber: varchar("admission_number", { length: 50 }),
  classId: uuid("class_id").references(() => classes.id),
  studentUserProfileId: uuid("student_user_profile_id").references(() => userProfiles.id),
  parentUserProfileId: uuid("parent_user_profile_id").references(() => userProfiles.id),
  parentName: varchar("parent_name", { length: 200 }),
  parentEmail: varchar("parent_email", { length: 255 }),
  parentContact: varchar("parent_contact", { length: 20 }),
  dateOfBirth: timestamp("date_of_birth"),
  gender: varchar("gender", { length: 10 }),
  bloodGroup: varchar("blood_group", { length: 5 }),
  admissionDate: timestamp("admission_date"),
});

// Subjects table
export const subjects = pgTable("subjects", {
  id: uuid("id").primaryKey().defaultRandom(),
  schoolId: uuid("school_id").notNull().references(() => schools.id),
  name: varchar("name", { length: 255 }).notNull(),
  code: varchar("code", { length: 50 }),
  description: text("description"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Attendance table
export const attendance = pgTable("attendance", {
  id: uuid("id").primaryKey().defaultRandom(),
  schoolId: uuid("school_id").notNull().references(() => schools.id),
  studentId: uuid("student_id").notNull().references(() => students.id),
  date: timestamp("date").notNull(),
  status: text("status").notNull(), // present, absent, late, leave
  remarks: text("remarks"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Timetable table - Enhanced for drag-and-drop, breaks, labs, activities
export const timetable = pgTable("timetable", {
  id: uuid("id").primaryKey().defaultRandom(),
  schoolId: uuid("school_id").notNull().references(() => schools.id),
  classId: uuid("class_id").notNull().references(() => classes.id),
  teacherProfileId: uuid("teacher_profile_id").references(() => userProfiles.id),
  subjectId: uuid("subject_id").references(() => subjects.id),
  dayOfWeek: integer("day_of_week").notNull(), // 1-7 (Monday-Sunday)
  periodNumber: integer("period_number").notNull(),
  startTime: text("start_time"),
  endTime: text("end_time"),
  periodType: varchar("period_type", { length: 50 }).default("class"), // class, break, lab, activity, assembly
  roomNumber: varchar("room_number", { length: 50 }),
  isLocked: boolean("is_locked").default(false), // Prevent accidental changes
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Timetable Templates - For CSV import/export
export const timetableTemplates = pgTable("timetable_templates", {
  id: uuid("id").primaryKey().defaultRandom(),
  schoolId: uuid("school_id").notNull().references(() => schools.id),
  templateName: varchar("template_name", { length: 255 }).notNull(),
  templateData: jsonb("template_data"), // Stores complete timetable structure
  academicYear: varchar("academic_year", { length: 10 }),
  createdAt: timestamp("created_at").defaultNow(),
});

// Fee Structure table
export const feeStructure = pgTable("fee_structure", {
  id: uuid("id").primaryKey().defaultRandom(),
  schoolId: uuid("school_id").notNull().references(() => schools.id),
  classId: uuid("class_id").notNull().references(() => classes.id),
  feeType: varchar("fee_type", { length: 50 }).notNull(),
  amount: decimal("amount", { precision: 10, scale: 2 }).notNull(),
  academicYear: varchar("academic_year", { length: 10 }).notNull(),
});

// Fee Payments table
export const feePayments = pgTable("fee_payments", {
  id: uuid("id").primaryKey().defaultRandom(),
  schoolId: uuid("school_id").notNull().references(() => schools.id),
  studentId: uuid("student_id").notNull().references(() => students.id),
  feeStructureId: uuid("fee_structure_id").references(() => feeStructure.id),
  amountPaid: decimal("amount_paid", { precision: 10, scale: 2 }).notNull(),
  paymentDate: timestamp("payment_date").defaultNow(),
  paymentMethod: varchar("payment_method", { length: 50 }),
  receiptNumber: varchar("receipt_number", { length: 100 }),
  paymentStatus: varchar("payment_status", { length: 50 }).default("success"), // success, pending, failed
  transactionId: varchar("transaction_id", { length: 255 }), // Gateway transaction ID
  gatewayTransactionId: varchar("gateway_transaction_id", { length: 255 }), // Specific gateway transaction ID
  isDuplicate: boolean("is_duplicate").default(false), // Duplicate payment detection
  gatewayResponse: jsonb("gateway_response"), // Full gateway response
  createdAt: timestamp("created_at").defaultNow(),
});

// Payment Failures - Track failed transactions
export const paymentFailures = pgTable("payment_failures", {
  id: uuid("id").primaryKey().defaultRandom(),
  schoolId: uuid("school_id").notNull().references(() => schools.id),
  studentId: uuid("student_id").notNull().references(() => students.id),
  feeStructureId: uuid("fee_structure_id").references(() => feeStructure.id),
  attemptedAmount: decimal("attempted_amount", { precision: 10, scale: 2 }).notNull(),
  failureReason: text("failure_reason"), // Card declined, insufficient funds, etc
  paymentMethod: varchar("payment_method", { length: 50 }),
  transactionId: varchar("transaction_id", { length: 255 }),
  gatewayResponse: jsonb("gateway_response"),
  failureDate: timestamp("failure_date").defaultNow(),
  retryCount: integer("retry_count").default(0),
  paymentLinkSent: boolean("payment_link_sent").default(false),
  paymentLinkSentAt: timestamp("payment_link_sent_at"),
  resolved: boolean("resolved").default(false), // True when payment eventually succeeds
  resolvedAt: timestamp("resolved_at"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Payment Links - Track payment links sent to parents
export const paymentLinks = pgTable("payment_links", {
  id: uuid("id").primaryKey().defaultRandom(),
  schoolId: uuid("school_id").notNull().references(() => schools.id),
  studentId: uuid("student_id").notNull().references(() => students.id),
  feeStructureId: uuid("fee_structure_id").references(() => feeStructure.id),
  paymentFailureId: uuid("payment_failure_id").references(() => paymentFailures.id),
  linkUrl: text("link_url").notNull(), // Payment gateway URL
  amount: decimal("amount", { precision: 10, scale: 2 }).notNull(),
  expiryDate: timestamp("expiry_date"),
  sentVia: varchar("sent_via", { length: 50 }), // sms, whatsapp, email
  recipientContact: varchar("recipient_contact", { length: 255 }), // Phone/email
  status: varchar("status", { length: 50 }).default("sent"), // sent, clicked, paid, expired
  clickedAt: timestamp("clicked_at"),
  paidAt: timestamp("paid_at"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Refunds - Track refund requests and processing
export const refunds = pgTable("refunds", {
  id: uuid("id").primaryKey().defaultRandom(),
  schoolId: uuid("school_id").notNull().references(() => schools.id),
  paymentId: uuid("payment_id").notNull().references(() => feePayments.id),
  studentId: uuid("student_id").notNull().references(() => students.id),
  refundAmount: decimal("refund_amount", { precision: 10, scale: 2 }).notNull(),
  refundReason: text("refund_reason"), // Duplicate payment, overpayment, cancelled admission
  refundType: varchar("refund_type", { length: 50 }), // full, partial
  refundMethod: varchar("refund_method", { length: 50 }), // original_payment_method, bank_transfer
  refundStatus: varchar("refund_status", { length: 50 }).default("pending"), // pending, processing, completed, failed
  requestedByUserId: uuid("requested_by_user_id").references(() => userProfiles.id),
  approvedByUserId: uuid("approved_by_user_id").references(() => userProfiles.id),
  gatewayRefundId: varchar("gateway_refund_id", { length: 255 }), // Payment gateway refund ID
  gatewayResponse: jsonb("gateway_response"),
  processingTime: varchar("processing_time", { length: 50 }), // 3-5 business days, 48 hours, etc
  requestedAt: timestamp("requested_at").defaultNow(),
  approvedAt: timestamp("approved_at"),
  completedAt: timestamp("completed_at"),
  failedAt: timestamp("failed_at"),
  failureReason: text("failure_reason"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Reconciliation Records - Daily/Monthly reconciliation logs
export const reconciliationRecords = pgTable("reconciliation_records", {
  id: uuid("id").primaryKey().defaultRandom(),
  schoolId: uuid("school_id").notNull().references(() => schools.id),
  reconciliationType: varchar("reconciliation_type", { length: 50 }), // daily, monthly, manual
  reconciliationDate: timestamp("reconciliation_date").notNull(),
  periodStart: timestamp("period_start").notNull(),
  periodEnd: timestamp("period_end").notNull(),
  expectedCollection: decimal("expected_collection", { precision: 12, scale: 2 }),
  actualCollection: decimal("actual_collection", { precision: 12, scale: 2 }),
  variance: decimal("variance", { precision: 12, scale: 2 }),
  bankStatementTotal: decimal("bank_statement_total", { precision: 12, scale: 2 }),
  gatewayTotal: decimal("gateway_total", { precision: 12, scale: 2 }),
  internalTotal: decimal("internal_total", { precision: 12, scale: 2 }),
  bankMatchPercentage: decimal("bank_match_percentage", { precision: 5, scale: 2 }),
  gatewayMatchPercentage: decimal("gateway_match_percentage", { precision: 5, scale: 2 }),
  internalMatchPercentage: decimal("internal_match_percentage", { precision: 5, scale: 2 }),
  discrepanciesFound: integer("discrepancies_found").default(0),
  discrepancyDetails: jsonb("discrepancy_details"), // Details of mismatches
  reconciledByUserId: uuid("reconciled_by_user_id").references(() => userProfiles.id),
  status: varchar("status", { length: 50 }).default("in_progress"), // in_progress, completed, issues_found
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow(),
  completedAt: timestamp("completed_at"),
});

// Tri-Party Verification Logs - Detailed verification between bank, gateway, internal
export const triPartyVerificationLogs = pgTable("tri_party_verification_logs", {
  id: uuid("id").primaryKey().defaultRandom(),
  schoolId: uuid("school_id").notNull().references(() => schools.id),
  reconciliationRecordId: uuid("reconciliation_record_id").references(() => reconciliationRecords.id),
  transactionId: varchar("transaction_id", { length: 255 }).notNull(),
  transactionDate: timestamp("transaction_date").notNull(),
  amount: decimal("amount", { precision: 10, scale: 2 }).notNull(),
  inBank: boolean("in_bank").default(false), // Found in bank statement
  inGateway: boolean("in_gateway").default(false), // Found in payment gateway
  inInternal: boolean("in_internal").default(false), // Found in internal records
  matchStatus: varchar("match_status", { length: 50 }), // matched, bank_only, gateway_only, internal_only, partial_match
  bankReference: varchar("bank_reference", { length: 255 }),
  gatewayReference: varchar("gateway_reference", { length: 255 }),
  internalReference: varchar("internal_reference", { length: 255 }),
  discrepancyNotes: text("discrepancy_notes"),
  resolvedByUserId: uuid("resolved_by_user_id").references(() => userProfiles.id),
  resolved: boolean("resolved").default(false),
  resolvedAt: timestamp("resolved_at"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Payment Gateway Transactions - Store all gateway transaction details
export const paymentGatewayTransactions = pgTable("payment_gateway_transactions", {
  id: uuid("id").primaryKey().defaultRandom(),
  schoolId: uuid("school_id").notNull().references(() => schools.id),
  paymentId: uuid("payment_id").references(() => feePayments.id),
  paymentFailureId: uuid("payment_failure_id").references(() => paymentFailures.id),
  gateway: varchar("gateway", { length: 50 }).notNull(), // stripe, razorpay, payu, paypal
  gatewayTransactionId: varchar("gateway_transaction_id", { length: 255 }).notNull(),
  amount: decimal("amount", { precision: 10, scale: 2 }).notNull(),
  currency: varchar("currency", { length: 10 }).default("INR"),
  status: varchar("status", { length: 50 }), // success, failed, pending, refunded
  paymentMethod: varchar("payment_method", { length: 50 }), // card, upi, netbanking, wallet
  cardLast4: varchar("card_last4", { length: 4 }),
  cardBrand: varchar("card_brand", { length: 50 }),
  gatewayFee: decimal("gateway_fee", { precision: 10, scale: 2 }),
  netAmount: decimal("net_amount", { precision: 10, scale: 2 }), // Amount after gateway fee
  webhookData: jsonb("webhook_data"), // Full webhook payload from gateway
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// School Modules - Control which modules each school has enabled
export const schoolModules = pgTable("school_modules", {
  id: uuid("id").primaryKey().defaultRandom(),
  schoolId: uuid("school_id").notNull().references(() => schools.id),
  moduleName: varchar("module_name", { length: 100 }).notNull(),
  isEnabled: boolean("is_enabled").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// System Settings - Multi-tenancy configuration per school
export const systemSettings = pgTable("system_settings", {
  id: uuid("id").primaryKey().defaultRandom(),
  schoolId: uuid("school_id").references(() => schools.id), // null for global settings
  settingKey: varchar("setting_key", { length: 255 }).notNull(),
  settingValue: text("setting_value"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Behavior Tracking
export const behaviorTracking = pgTable("behavior_tracking", {
  id: uuid("id").primaryKey().defaultRandom(),
  schoolId: uuid("school_id").notNull().references(() => schools.id),
  studentId: uuid("student_id").notNull().references(() => students.id),
  reportedByUserProfileId: uuid("reported_by_user_profile_id").references(() => userProfiles.id),
  behaviorType: varchar("behavior_type", { length: 50 }),
  description: text("description"),
  severity: varchar("severity", { length: 20 }),
  actionTaken: text("action_taken"),
  incidentDate: timestamp("incident_date").defaultNow(),
  createdAt: timestamp("created_at").defaultNow(),
});

// Substitutions - Enhanced with accept/reject workflow
export const substitutions = pgTable("substitutions", {
  id: uuid("id").primaryKey().defaultRandom(),
  schoolId: uuid("school_id").notNull().references(() => schools.id),
  absentTeacherProfileId: uuid("absent_teacher_profile_id").references(() => userProfiles.id),
  substituteTeacherProfileId: uuid("substitute_teacher_profile_id").references(() => userProfiles.id),
  classId: uuid("class_id").references(() => classes.id),
  subjectId: uuid("subject_id").references(() => subjects.id),
  substitutionDate: timestamp("substitution_date").notNull(),
  periodNumber: integer("period_number"),
  reason: text("reason"),
  manualOverrideReason: text("manual_override_reason"), // NEW: Manual override reason
  status: varchar("status", { length: 50 }).default("pending"), // NEW: pending, accepted, rejected, completed
  responseNote: text("response_note"), // NEW: Teacher's response when accepting/rejecting
  respondedAt: timestamp("responded_at"), // NEW: When teacher responded
  aiScore: decimal("ai_score", { precision: 5, scale: 2 }), // AI substitution score
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Substitution History - Track all substitution events
export const substitutionHistory = pgTable("substitution_history", {
  id: uuid("id").primaryKey().defaultRandom(),
  schoolId: uuid("school_id").notNull().references(() => schools.id),
  substitutionId: uuid("substitution_id").references(() => substitutions.id),
  action: varchar("action", { length: 100 }).notNull(), // created, accepted, rejected, completed, modified
  performedByUserProfileId: uuid("performed_by_user_profile_id").references(() => userProfiles.id),
  details: text("details"),
  timestamp: timestamp("timestamp").defaultNow(),
});

// Class Student Statistics
export const classStudentStats = pgTable("class_student_stats", {
  id: uuid("id").primaryKey().defaultRandom(),
  schoolId: uuid("school_id").notNull().references(() => schools.id),
  classId: uuid("class_id").references(() => classes.id),
  academicYear: varchar("academic_year", { length: 10 }),
  totalStudents: integer("total_students"),
  maleStudents: integer("male_students"),
  femaleStudents: integer("female_students"),
  distributionData: jsonb("distribution_data"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Report Tracker - Enhanced
export const reportTracker = pgTable("report_tracker", {
  id: uuid("id").primaryKey().defaultRandom(),
  schoolId: uuid("school_id").notNull().references(() => schools.id),
  studentId: uuid("student_id").references(() => students.id),
  reportType: varchar("report_type", { length: 100 }),
  reportData: jsonb("report_data"),
  generatedByUserId: uuid("generated_by_user_id").references(() => userProfiles.id),
  academicYear: varchar("academic_year", { length: 10 }),
  createdAt: timestamp("created_at").defaultNow(),
});

// Marks Entry - Comprehensive with multi-assessment support
export const marksEntry = pgTable("marks_entry", {
  id: uuid("id").primaryKey().defaultRandom(),
  schoolId: uuid("school_id").notNull().references(() => schools.id),
  studentId: uuid("student_id").notNull().references(() => students.id),
  classId: uuid("class_id").notNull().references(() => classes.id),
  subjectId: uuid("subject_id").notNull().references(() => subjects.id),
  examType: varchar("exam_type", { length: 100 }).notNull(), // FA1, FA2, SA1, SA2, Term1, Term2, etc
  maxMarks: integer("max_marks").notNull(),
  marksObtained: decimal("marks_obtained", { precision: 5, scale: 2 }).notNull(),
  grade: varchar("grade", { length: 5 }), // A1, A2, B1, etc
  remarks: text("remarks"),
  isLocked: boolean("is_locked").default(false), // Lock to prevent changes
  lockedAt: timestamp("locked_at"),
  lockedByUserProfileId: uuid("locked_by_user_profile_id").references(() => userProfiles.id),
  overrideByUserProfileId: uuid("override_by_user_profile_id").references(() => userProfiles.id), // NEW: Admin override
  overrideReason: text("override_reason"), // NEW: Reason for override
  enteredByUserProfileId: uuid("entered_by_user_profile_id").references(() => userProfiles.id),
  academicYear: varchar("academic_year", { length: 10 }),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Class Analytics - Store computed analytics for performance
export const classAnalytics = pgTable("class_analytics", {
  id: uuid("id").primaryKey().defaultRandom(),
  schoolId: uuid("school_id").notNull().references(() => schools.id),
  classId: uuid("class_id").notNull().references(() => classes.id),
  subjectId: uuid("subject_id").references(() => subjects.id),
  examType: varchar("exam_type", { length: 100 }),
  classAverage: decimal("class_average", { precision: 5, scale: 2 }),
  highestMarks: decimal("highest_marks", { precision: 5, scale: 2 }),
  lowestMarks: decimal("lowest_marks", { precision: 5, scale: 2 }),
  passPercentage: decimal("pass_percentage", { precision: 5, scale: 2 }),
  topperStudentIds: text("topper_student_ids").array(), // Array of top student IDs
  analyticsData: jsonb("analytics_data"), // Distribution charts, etc
  academicYear: varchar("academic_year", { length: 10 }),
  computedAt: timestamp("computed_at").defaultNow(),
});

// Question Paper Generation
export const questionPaperGeneration = pgTable("question_paper_generation", {
  id: uuid("id").primaryKey().defaultRandom(),
  schoolId: uuid("school_id").notNull().references(() => schools.id),
  generatedByUserProfileId: uuid("generated_by_user_profile_id").references(() => userProfiles.id),
  subjectId: uuid("subject_id").references(() => subjects.id),
  classId: uuid("class_id").references(() => classes.id),
  examType: varchar("exam_type", { length: 100 }),
  totalMarks: integer("total_marks"),
  duration: integer("duration"),
  paperData: jsonb("paper_data"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Question Extractor
export const questionExtractor = pgTable("question_extractor", {
  id: uuid("id").primaryKey().defaultRandom(),
  schoolId: uuid("school_id").notNull().references(() => schools.id),
  extractedByUserProfileId: uuid("extracted_by_user_profile_id").references(() => userProfiles.id),
  sourceDocument: text("source_document"),
  extractedQuestions: jsonb("extracted_questions"),
  subjectId: uuid("subject_id").references(() => subjects.id),
  createdAt: timestamp("created_at").defaultNow(),
});

// Voice to Text
export const voiceToText = pgTable("voice_to_text", {
  id: uuid("id").primaryKey().defaultRandom(),
  schoolId: uuid("school_id").notNull().references(() => schools.id),
  transcribedByUserProfileId: uuid("transcribed_by_user_profile_id").references(() => userProfiles.id),
  audioFileUrl: text("audio_file_url"),
  transcription: text("transcription"),
  language: varchar("language", { length: 50 }),
  duration: integer("duration"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Admission Management
export const admissionManagement = pgTable("admission_management", {
  id: uuid("id").primaryKey().defaultRandom(),
  schoolId: uuid("school_id").notNull().references(() => schools.id),
  applicantName: varchar("applicant_name", { length: 255 }),
  applicantEmail: varchar("applicant_email", { length: 255 }),
  applicantPhone: varchar("applicant_phone", { length: 20 }),
  appliedForClass: varchar("applied_for_class", { length: 50 }),
  applicationStatus: varchar("application_status", { length: 50 }),
  applicationData: jsonb("application_data"),
  academicYear: varchar("academic_year", { length: 10 }),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// PDF Tools
export const pdfTools = pgTable("pdf_tools", {
  id: uuid("id").primaryKey().defaultRandom(),
  schoolId: uuid("school_id").notNull().references(() => schools.id),
  usedByUserProfileId: uuid("used_by_user_profile_id").references(() => userProfiles.id),
  toolType: varchar("tool_type", { length: 100 }),
  inputFileUrl: text("input_file_url"),
  outputFileUrl: text("output_file_url"),
  operationData: jsonb("operation_data"),
  createdAt: timestamp("created_at").defaultNow(),
});

// School Events - Enhanced with category tagging, AI summarizer, PDF export
export const schoolEvents = pgTable("school_events", {
  id: uuid("id").primaryKey().defaultRandom(),
  schoolId: uuid("school_id").notNull().references(() => schools.id),
  eventName: varchar("event_name", { length: 255 }).notNull(),
  eventType: varchar("event_type", { length: 100 }), // academic, sports, cultural, examination
  eventCategory: varchar("event_category", { length: 100 }), // NEW: For filtering/tagging
  eventTags: text("event_tags").array(), // NEW: Multiple tags for searchability
  eventDate: timestamp("event_date"),
  eventDescription: text("event_description"),
  aiSummary: text("ai_summary"), // NEW: Gemini AI generated summary
  aiSummaryGeneratedAt: timestamp("ai_summary_generated_at"), // NEW
  eventLocation: varchar("event_location", { length: 255 }),
  organizedBy: uuid("organized_by").references(() => userProfiles.id),
  attendeeCount: integer("attendee_count"),
  expectedParticipants: integer("expected_participants"), // Expected number of participants
  eventStatus: varchar("event_status", { length: 50 }).default("scheduled"), // scheduled, ongoing, completed, cancelled
  pdfExportUrl: text("pdf_export_url"), // NEW: PDF export with watermark
  pdfWatermarkApplied: boolean("pdf_watermark_applied").default(false), // NEW
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// WhatsApp Alerts
export const whatsappAlerts = pgTable("whatsapp_alerts", {
  id: uuid("id").primaryKey().defaultRandom(),
  schoolId: uuid("school_id").notNull().references(() => schools.id),
  recipientPhone: varchar("recipient_phone", { length: 20 }).notNull(),
  messageContent: text("message_content").notNull(),
  messageStatus: varchar("message_status", { length: 50 }),
  messageType: varchar("message_type", { length: 100 }),
  sentAt: timestamp("sent_at"),
  deliveredAt: timestamp("delivered_at"),
  externalMessageId: varchar("external_message_id", { length: 100 }),
  createdAt: timestamp("created_at").defaultNow(),
});

// Vipu AI (Principal's AI analytics)
export const vipuAi = pgTable("vipu_ai", {
  id: uuid("id").primaryKey().defaultRandom(),
  schoolId: uuid("school_id").notNull().references(() => schools.id),
  reportType: varchar("report_type", { length: 100 }),
  generatedByUserId: uuid("generated_by_user_id").references(() => userProfiles.id),
  reportData: jsonb("report_data"),
  aiAnalysis: text("ai_analysis"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Timesubbehave AI Premium
export const timesubbehaveAiPremium = pgTable("timesubbehave_ai_premium", {
  id: uuid("id").primaryKey().defaultRandom(),
  schoolId: uuid("school_id").notNull().references(() => schools.id),
  generatedByUserProfileId: uuid("generated_by_user_profile_id").references(() => userProfiles.id),
  analysisType: varchar("analysis_type", { length: 100 }),
  behaviorData: jsonb("behavior_data"),
  substitutionData: jsonb("substitution_data"),
  aiRecommendations: text("ai_recommendations"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Fee Tally Integration
export const feeTallyIntegration = pgTable("fee_tally_integration", {
  id: uuid("id").primaryKey().defaultRandom(),
  schoolId: uuid("school_id").notNull().references(() => schools.id),
  tallyCompanyName: varchar("tally_company_name", { length: 255 }),
  syncStatus: varchar("sync_status", { length: 50 }),
  lastSyncedAt: timestamp("last_synced_at"),
  syncData: jsonb("sync_data"),
  errorLog: text("error_log"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// ID Card Generator
export const idCardGenerator = pgTable("id_card_generator", {
  id: uuid("id").primaryKey().defaultRandom(),
  schoolId: uuid("school_id").notNull().references(() => schools.id),
  requestedByUserProfileId: uuid("requested_by_user_profile_id").references(() => userProfiles.id),
  cardType: varchar("card_type", { length: 50 }),
  studentId: uuid("student_id").references(() => students.id),
  teacherId: uuid("teacher_id").references(() => teachers.id),
  cardDesign: jsonb("card_design"),
  cardFileUrl: text("card_file_url"),
  createdAt: timestamp("created_at").defaultNow(),
});

// CBSE Registration
export const cbseRegistration = pgTable("cbse_registration", {
  id: uuid("id").primaryKey().defaultRandom(),
  schoolId: uuid("school_id").notNull().references(() => schools.id),
  submittedByUserProfileId: uuid("submitted_by_user_profile_id").references(() => userProfiles.id),
  studentId: uuid("student_id").references(() => students.id),
  registrationNumber: varchar("registration_number", { length: 100 }),
  examType: varchar("exam_type", { length: 50 }),
  academicYear: varchar("academic_year", { length: 10 }),
  registrationStatus: varchar("registration_status", { length: 50 }),
  registrationData: jsonb("registration_data"),
  submittedAt: timestamp("submitted_at"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// VipuDev AI (Super Admin only)
export const vipudevAi = pgTable("vipudev_ai", {
  id: uuid("id").primaryKey().defaultRandom(),
  schoolId: uuid("school_id").references(() => schools.id),
  command: text("command").notNull(),
  executedByUserId: uuid("executed_by_user_id").references(() => userProfiles.id),
  executionResult: text("execution_result"),
  executionStatus: varchar("execution_status", { length: 50 }),
  createdAt: timestamp("created_at").defaultNow(),
});

// Arattai Templates
export const arattaiTemplates = pgTable("arattai_templates", {
  id: uuid("id").primaryKey().defaultRandom(),
  schoolId: uuid("school_id").references(() => schools.id),
  templateName: varchar("template_name", { length: 255 }).notNull(),
  templateCategory: varchar("template_category", { length: 100 }),
  templateType: varchar("template_type", { length: 50 }),
  messageContent: text("message_content").notNull(),
  variables: text("variables").array(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Arattai Contacts
export const arattaiContacts = pgTable("arattai_contacts", {
  id: uuid("id").primaryKey().defaultRandom(),
  schoolId: uuid("school_id").notNull().references(() => schools.id),
  userProfileId: uuid("user_profile_id").references(() => userProfiles.id),
  phoneNumber: varchar("phone_number", { length: 20 }).notNull(),
  name: varchar("name", { length: 255 }),
  role: varchar("role", { length: 50 }),
  consentGiven: boolean("consent_given").default(false),
  isOptedOut: boolean("is_opted_out").default(false),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Arattai Scheduled Messages
export const arattaiScheduledMessages = pgTable("arattai_scheduled_messages", {
  id: uuid("id").primaryKey().defaultRandom(),
  schoolId: uuid("school_id").notNull().references(() => schools.id),
  templateId: uuid("template_id").references(() => arattaiTemplates.id),
  arattaiContactId: uuid("arattai_contact_id").references(() => arattaiContacts.id),
  createdByUserProfileId: uuid("created_by_user_profile_id").references(() => userProfiles.id),
  scheduledFor: timestamp("scheduled_for").notNull(),
  messageStatus: varchar("message_status", { length: 50 }),
  messageContent: text("message_content"),
  sentAt: timestamp("sent_at"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Arattai Broadcast Campaigns
export const arattaiBroadcastCampaigns = pgTable("arattai_broadcast_campaigns", {
  id: uuid("id").primaryKey().defaultRandom(),
  schoolId: uuid("school_id").notNull().references(() => schools.id),
  templateId: uuid("template_id").references(() => arattaiTemplates.id),
  campaignName: varchar("campaign_name", { length: 255 }).notNull(),
  targetAudience: varchar("target_audience", { length: 100 }),
  scheduledFor: timestamp("scheduled_for"),
  campaignStatus: varchar("campaign_status", { length: 50 }),
  totalRecipients: integer("total_recipients"),
  sentCount: integer("sent_count"),
  deliveredCount: integer("delivered_count"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Arattai Automation Rules
export const arattaiAutomationRules = pgTable("arattai_automation_rules", {
  id: uuid("id").primaryKey().defaultRandom(),
  schoolId: uuid("school_id").notNull().references(() => schools.id),
  templateId: uuid("template_id").references(() => arattaiTemplates.id),
  createdByUserProfileId: uuid("created_by_user_profile_id").references(() => userProfiles.id),
  ruleName: varchar("rule_name", { length: 255 }).notNull(),
  triggerEvent: varchar("trigger_event", { length: 100 }),
  triggerConditions: jsonb("trigger_conditions"),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Arattai Message Logs
export const arattaiMessageLogs = pgTable("arattai_message_logs", {
  id: uuid("id").primaryKey().defaultRandom(),
  schoolId: uuid("school_id").notNull().references(() => schools.id),
  arattaiContactId: uuid("arattai_contact_id").references(() => arattaiContacts.id),
  arattaiExternalMessageId: varchar("arattai_external_message_id", { length: 100 }),
  messageContent: text("message_content"),
  messageStatus: varchar("message_status", { length: 50 }),
  messageType: varchar("message_type", { length: 50 }),
  sentAt: timestamp("sent_at"),
  deliveredAt: timestamp("delivered_at"),
  readAt: timestamp("read_at"),
  failedReason: text("failed_reason"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Arattai Settings
export const arattaiSettings = pgTable("arattai_settings", {
  id: uuid("id").primaryKey().defaultRandom(),
  schoolId: uuid("school_id").notNull().references(() => schools.id),
  apiKey: text("api_key"),
  apiSecret: text("api_secret"),
  senderId: varchar("sender_id", { length: 50 }),
  dailyLimit: integer("daily_limit"),
  isActive: boolean("is_active").default(true),
  settingsData: jsonb("settings_data"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// School Settings - Per-school configuration for payment gateways, AI, WhatsApp, etc
export const schoolSettings = pgTable("school_settings", {
  id: uuid("id").primaryKey().defaultRandom(),
  schoolId: uuid("school_id").notNull().references(() => schools.id),
  settingCategory: varchar("setting_category", { length: 100 }).notNull(), // payment_gateway, ai_integration, whatsapp_integration, etc
  settingKey: varchar("setting_key", { length: 255 }).notNull(),
  settingValue: text("setting_value"),
  settingDescription: text("setting_description"),
  isEncrypted: boolean("is_encrypted").default(false),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// School Settings Audit Log - Track changes to school settings
export const schoolSettingsAuditLog = pgTable("school_settings_audit_log", {
  id: uuid("id").primaryKey().defaultRandom(),
  schoolId: uuid("school_id").notNull().references(() => schools.id),
  settingId: uuid("setting_id").references(() => schoolSettings.id),
  settingKey: varchar("setting_key", { length: 255 }).notNull(),
  oldValue: text("old_value"),
  newValue: text("new_value"),
  changedByUserId: uuid("changed_by_user_id").references(() => userProfiles.id),
  changeReason: text("change_reason"),
  ipAddress: varchar("ip_address", { length: 50 }),
  createdAt: timestamp("created_at").defaultNow(),
});

// Refund Requests - Track refund requests and processing
export const refundRequests = pgTable("refund_requests", {
  id: uuid("id").primaryKey().defaultRandom(),
  schoolId: uuid("school_id").notNull().references(() => schools.id),
  paymentId: uuid("payment_id").references(() => feePayments.id),
  studentId: uuid("student_id").references(() => students.id),
  refundAmount: decimal("refund_amount", { precision: 10, scale: 2 }).notNull(),
  refundReason: text("refund_reason"),
  refundType: varchar("refund_type", { length: 50 }), // full, partial
  refundMethod: varchar("refund_method", { length: 50 }), // original_payment_method, bank_transfer, cash
  refundStatus: varchar("refund_status", { length: 50 }).default("pending"), // pending, processing, completed, failed
  requestedByUserId: uuid("requested_by_user_id").references(() => userProfiles.id),
  approvedByUserId: uuid("approved_by_user_id").references(() => userProfiles.id),
  processingTime: varchar("processing_time", { length: 50 }),
  gatewayRefundId: varchar("gateway_refund_id", { length: 255 }),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Audit Logs - Enhanced for settings change tracking
export const auditLogs = pgTable("audit_logs", {
  id: uuid("id").primaryKey().defaultRandom(),
  schoolId: uuid("school_id").references(() => schools.id),
  userId: uuid("user_id"),
  action: varchar("action", { length: 100 }).notNull(),
  entityType: varchar("entity_type", { length: 100 }), // settings, user, fee, attendance, etc
  entityId: uuid("entity_id"),
  details: jsonb("details"), // Stores before/after values for settings
  oldValue: text("old_value"), // NEW: Previous setting value
  newValue: text("new_value"), // NEW: New setting value
  settingKey: varchar("setting_key", { length: 255 }), // NEW: Which setting was changed
  ipAddress: varchar("ip_address", { length: 50 }),
  userAgent: text("user_agent"), // NEW: Browser/device info
  createdAt: timestamp("created_at").defaultNow(),
});

// Settings Backup - JSON export/import of configurations
export const settingsBackup = pgTable("settings_backup", {
  id: uuid("id").primaryKey().defaultRandom(),
  schoolId: uuid("school_id").notNull().references(() => schools.id),
  backupName: varchar("backup_name", { length: 255 }).notNull(),
  configData: jsonb("config_data"), // Complete settings snapshot
  createdByUserProfileId: uuid("created_by_user_profile_id").references(() => userProfiles.id),
  backupType: varchar("backup_type", { length: 50 }).default("manual"), // manual, automatic
  createdAt: timestamp("created_at").defaultNow(),
});

// ==================== ATTENDANCE MANAGEMENT TABLES ====================

// Attendance Records (for barcode attendance)
export const attendanceRecords = pgTable("attendance_records", {
  id: uuid("id").primaryKey().defaultRandom(),
  schoolId: uuid("school_id").notNull().references(() => schools.id),
  classId: uuid("class_id").references(() => classes.id),
  studentId: uuid("student_id").references(() => students.id),
  attendanceDate: timestamp("attendance_date").notNull(),
  status: varchar("status", { length: 50 }),
  scannedBarcode: varchar("scanned_barcode", { length: 100 }),
  scannedAt: timestamp("scanned_at"),
  markedByUserProfileId: uuid("marked_by_user_profile_id").references(() => userProfiles.id),
  remarks: text("remarks"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Attendance GPS Logs (for teacher GPS attendance)
export const attendanceGpsLogs = pgTable("attendance_gps_logs", {
  id: uuid("id").primaryKey().defaultRandom(),
  schoolId: uuid("school_id").notNull().references(() => schools.id),
  teacherId: uuid("teacher_id").references(() => teachers.id),
  teacherUserProfileId: uuid("teacher_user_profile_id").references(() => userProfiles.id),
  latitude: varchar("latitude", { length: 50 }),
  longitude: varchar("longitude", { length: 50 }),
  markedAt: timestamp("marked_at").notNull(),
  distanceFromSchool: decimal("distance_from_school", { precision: 10, scale: 2 }), // in meters
  outOfRange: boolean("out_of_range").default(false),
  statusColor: varchar("status_color", { length: 20 }).default("green"), // green, orange, red
  biometricVerified: boolean("biometric_verified").default(false),
  biometricData: text("biometric_data"),
  deviceInfo: jsonb("device_info"), // Device details
  createdAt: timestamp("created_at").defaultNow(),
});

// Principal Alerts - Real-time alerts for out-of-range GPS, late arrivals, etc
export const principalAlerts = pgTable("principal_alerts", {
  id: uuid("id").primaryKey().defaultRandom(),
  schoolId: uuid("school_id").notNull().references(() => schools.id),
  alertType: varchar("alert_type", { length: 50 }).notNull(), // gps_out_of_range, late_arrival, absent_spike, suspicious_activity
  severity: varchar("severity", { length: 20 }).default("medium"), // low, medium, high, critical
  title: varchar("title", { length: 255 }).notNull(),
  message: text("message").notNull(),
  relatedEntityType: varchar("related_entity_type", { length: 50 }), // teacher, student, class
  relatedEntityId: uuid("related_entity_id"),
  gpsLogId: uuid("gps_log_id").references(() => attendanceGpsLogs.id),
  attendanceRecordId: uuid("attendance_record_id").references(() => attendanceRecords.id),
  sentToUserProfileIds: jsonb("sent_to_user_profile_ids"), // Array of principal/admin IDs
  sentVia: varchar("sent_via", { length: 100 }), // dashboard, whatsapp, arattai, email
  acknowledged: boolean("acknowledged").default(false),
  acknowledgedBy: uuid("acknowledged_by").references(() => userProfiles.id),
  acknowledgedAt: timestamp("acknowledged_at"),
  actionTaken: text("action_taken"),
  resolved: boolean("resolved").default(false),
  resolvedAt: timestamp("resolved_at"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Attendance Dashboard Data - Pre-computed analytics for Principal's dashboard
export const attendanceDashboardData = pgTable("attendance_dashboard_data", {
  id: uuid("id").primaryKey().defaultRandom(),
  schoolId: uuid("school_id").notNull().references(() => schools.id),
  dashboardDate: timestamp("dashboard_date").notNull(),
  totalStudentsExpected: integer("total_students_expected").default(0),
  totalStudentsPresent: integer("total_students_present").default(0),
  totalStudentsAbsent: integer("total_students_absent").default(0),
  totalStudentsLate: integer("total_students_late").default(0),
  attendancePercentage: decimal("attendance_percentage", { precision: 5, scale: 2 }),
  totalTeachersExpected: integer("total_teachers_expected").default(0),
  totalTeachersPresent: integer("total_teachers_present").default(0),
  teachersInRange: integer("teachers_in_range").default(0), // green zone
  teachersNearRange: integer("teachers_near_range").default(0), // orange zone
  teachersOutOfRange: integer("teachers_out_of_range").default(0), // red zone
  alertsGenerated: integer("alerts_generated").default(0),
  criticalAlerts: integer("critical_alerts").default(0),
  classwiseData: jsonb("classwise_data"), // Breakdown by class
  hourlyData: jsonb("hourly_data"), // Hourly attendance trends
  gpsHeatmapData: jsonb("gps_heatmap_data"), // GPS coordinates for heatmap
  lastUpdated: timestamp("last_updated").defaultNow(),
  createdAt: timestamp("created_at").defaultNow(),
});

// GPS Attendance Sessions - Track individual GPS attendance sessions
export const gpsAttendanceSessions = pgTable("gps_attendance_sessions", {
  id: uuid("id").primaryKey().defaultRandom(),
  schoolId: uuid("school_id").notNull().references(() => schools.id),
  teacherId: uuid("teacher_id").references(() => teachers.id),
  teacherUserProfileId: uuid("teacher_user_profile_id").references(() => userProfiles.id),
  mobileLink: varchar("mobile_link", { length: 255 }), // Unique link for teacher
  linkExpiresAt: timestamp("link_expires_at"),
  sessionStarted: timestamp("session_started"),
  sessionEnded: timestamp("session_ended"),
  status: varchar("status", { length: 50 }).default("pending"), // pending, active, completed, expired
  totalCheckIns: integer("total_check_ins").default(0),
  inRangeCheckIns: integer("in_range_check_ins").default(0),
  outOfRangeCheckIns: integer("out_of_range_check_ins").default(0),
  createdAt: timestamp("created_at").defaultNow(),
});

// Barcode Attendance Sessions - Track barcode scanning sessions
export const barcodeAttendanceSessions = pgTable("barcode_attendance_sessions", {
  id: uuid("id").primaryKey().defaultRandom(),
  schoolId: uuid("school_id").notNull().references(() => schools.id),
  classId: uuid("class_id").references(() => classes.id),
  scannedByUserProfileId: uuid("scanned_by_user_profile_id").references(() => userProfiles.id),
  sessionDate: timestamp("session_date").notNull(),
  totalScans: integer("total_scans").default(0),
  validScans: integer("valid_scans").default(0),
  invalidScans: integer("invalid_scans").default(0),
  duplicateScans: integer("duplicate_scans").default(0),
  sessionStarted: timestamp("session_started"),
  sessionEnded: timestamp("session_ended"),
  status: varchar("status", { length: 50 }).default("active"), // active, completed, abandoned
  createdAt: timestamp("created_at").defaultNow(),
});

// ==================== TRANSPORTATION MANAGEMENT TABLES ====================

// Vehicles/Buses
export const transportVehicles = pgTable("transport_vehicles", {
  id: uuid("id").primaryKey().defaultRandom(),
  schoolId: uuid("school_id").notNull().references(() => schools.id),
  vehicleNumber: varchar("vehicle_number", { length: 50 }).notNull(),
  vehicleType: varchar("vehicle_type", { length: 50 }),
  capacity: integer("capacity"),
  driverName: varchar("driver_name", { length: 255 }),
  driverPhone: varchar("driver_phone", { length: 20 }),
  conductorName: varchar("conductor_name", { length: 255 }),
  conductorPhone: varchar("conductor_phone", { length: 20 }),
  gpsDeviceId: varchar("gps_device_id", { length: 100 }),
  vehicleStatus: varchar("vehicle_status", { length: 50 }),
  insuranceExpiryDate: timestamp("insurance_expiry_date"),
  fitnessExpiryDate: timestamp("fitness_expiry_date"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Transport Routes
export const transportRoutes = pgTable("transport_routes", {
  id: uuid("id").primaryKey().defaultRandom(),
  schoolId: uuid("school_id").notNull().references(() => schools.id),
  vehicleId: uuid("vehicle_id").references(() => transportVehicles.id),
  routeName: varchar("route_name", { length: 255 }).notNull(),
  routeNumber: varchar("route_number", { length: 50 }),
  pickupTime: varchar("pickup_time", { length: 20 }),
  dropTime: varchar("drop_time", { length: 20 }),
  stops: jsonb("stops"),
  routeDistance: varchar("route_distance", { length: 50 }),
  monthlyFee: integer("monthly_fee"),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Bus Attendance (Barcode Integration)
export const busAttendance = pgTable("bus_attendance", {
  id: uuid("id").primaryKey().defaultRandom(),
  schoolId: uuid("school_id").notNull().references(() => schools.id),
  vehicleId: uuid("vehicle_id").references(() => transportVehicles.id),
  routeId: uuid("route_id").references(() => transportRoutes.id),
  studentId: uuid("student_id").references(() => students.id),
  attendanceDate: timestamp("attendance_date").notNull(),
  scannedBarcode: varchar("scanned_barcode", { length: 100 }),
  boardingTime: timestamp("boarding_time"),
  alightingTime: timestamp("alighting_time"),
  boardingStop: varchar("boarding_stop", { length: 255 }),
  alightingStop: varchar("alighting_stop", { length: 255 }),
  status: varchar("status", { length: 50 }),
  markedByUserProfileId: uuid("marked_by_user_profile_id").references(() => userProfiles.id),
  createdAt: timestamp("created_at").defaultNow(),
});

// GPS Tracking Logs - Enhanced for real-time tracking (not dummy data)
export const gpsTrackingLogs = pgTable("gps_tracking_logs", {
  id: uuid("id").primaryKey().defaultRandom(),
  schoolId: uuid("school_id").notNull().references(() => schools.id),
  vehicleId: uuid("vehicle_id").references(() => transportVehicles.id),
  latitude: varchar("latitude", { length: 50 }), // Keep as varchar for compatibility
  longitude: varchar("longitude", { length: 50 }), // Keep as varchar for compatibility
  speed: varchar("speed", { length: 20 }), // Keep as varchar for compatibility
  heading: varchar("heading", { length: 20 }), // NEW: Direction in degrees
  accuracy: varchar("accuracy", { length: 20 }), // NEW: GPS accuracy in meters
  timestamp: timestamp("timestamp").notNull(),
  location: varchar("location", { length: 500 }), // Reverse geocoded address
  isMoving: boolean("is_moving").default(true), // NEW: Vehicle movement status
  ignitionStatus: boolean("ignition_status"), // NEW: Engine on/off
  batteryLevel: integer("battery_level"), // NEW: GPS device battery %
  deviceId: varchar("device_id", { length: 100 }), // NEW: GPS device identifier
  createdAt: timestamp("created_at").defaultNow(),
});

// Live Bus Tracking - Real-time bus positions for parent app
export const liveBusTracking = pgTable("live_bus_tracking", {
  id: uuid("id").primaryKey().defaultRandom(),
  schoolId: uuid("school_id").notNull().references(() => schools.id),
  vehicleId: uuid("vehicle_id").notNull().references(() => transportVehicles.id),
  routeId: uuid("route_id").references(() => transportRoutes.id),
  currentLatitude: decimal("current_latitude", { precision: 10, scale: 8 }),
  currentLongitude: decimal("current_longitude", { precision: 11, scale: 8 }),
  currentSpeed: decimal("current_speed", { precision: 5, scale: 2 }),
  nextStopName: varchar("next_stop_name", { length: 255 }),
  estimatedArrival: timestamp("estimated_arrival"),
  studentsOnBoard: integer("students_on_board").default(0),
  lastUpdated: timestamp("last_updated").defaultNow(),
});

// Student Transport Allocation
export const studentTransportAllocation = pgTable("student_transport_allocation", {
  id: uuid("id").primaryKey().defaultRandom(),
  schoolId: uuid("school_id").notNull().references(() => schools.id),
  studentId: uuid("student_id").references(() => students.id),
  vehicleId: uuid("vehicle_id").references(() => transportVehicles.id),
  routeId: uuid("route_id").references(() => transportRoutes.id),
  pickupStop: varchar("pickup_stop", { length: 255 }),
  dropStop: varchar("drop_stop", { length: 255 }),
  academicYear: varchar("academic_year", { length: 10 }),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// ==================== LIBRARY MANAGEMENT TABLES ====================

// Library Books Catalog - Enhanced with advanced search support
export const libraryBooks = pgTable("library_books", {
  id: uuid("id").primaryKey().defaultRandom(),
  schoolId: uuid("school_id").notNull().references(() => schools.id),
  bookTitle: varchar("book_title", { length: 500 }).notNull(),
  author: varchar("author", { length: 255 }),
  isbn: varchar("isbn", { length: 50 }), // NEW: For ISBN scanner integration
  accessionNumber: varchar("accession_number", { length: 100 }).notNull(),
  barcode: varchar("barcode", { length: 100 }), // NEW: For barcode scanner integration
  publisher: varchar("publisher", { length: 255 }),
  publicationYear: varchar("publication_year", { length: 10 }),
  category: varchar("category", { length: 100 }), // NEW: For category filters
  subject: varchar("subject", { length: 100 }), // NEW: For subject filters
  language: varchar("language", { length: 50 }),
  numberOfCopies: integer("number_of_copies").default(1),
  availableCopies: integer("available_copies").default(1),
  location: varchar("location", { length: 100 }), // Shelf location
  purchaseDate: timestamp("purchase_date"),
  price: integer("price"),
  bookStatus: varchar("book_status", { length: 50 }), // available, issued, damaged, lost
  coverImageUrl: text("cover_image_url"),
  description: text("description"),
  rating: decimal("rating", { precision: 2, scale: 1 }), // NEW: Book rating
  totalIssues: integer("total_issues").default(0), // NEW: Track popularity
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Library Transaction History - Comprehensive per student/book tracking
export const libraryTransactionHistory = pgTable("library_transaction_history", {
  id: uuid("id").primaryKey().defaultRandom(),
  schoolId: uuid("school_id").notNull().references(() => schools.id),
  bookId: uuid("book_id").notNull().references(() => libraryBooks.id),
  studentId: uuid("student_id").references(() => students.id),
  teacherId: uuid("teacher_id").references(() => teachers.id),
  transactionType: varchar("transaction_type", { length: 50 }).notNull(), // issue, return, renew, reserve
  issueDate: timestamp("issue_date"),
  returnDate: timestamp("return_date"),
  actualReturnDate: timestamp("actual_return_date"),
  fineAmount: decimal("fine_amount", { precision: 10, scale: 2 }).default('0'),
  finePaid: boolean("fine_paid").default(false),
  condition: varchar("condition", { length: 50 }), // good, fair, damaged
  notes: text("notes"),
  issuedByUserProfileId: uuid("issued_by_user_profile_id").references(() => userProfiles.id),
  returnedByUserProfileId: uuid("returned_by_user_profile_id").references(() => userProfiles.id),
  createdAt: timestamp("created_at").defaultNow(),
});

// Library Issue/Return (Barcode Integration)
export const libraryIssueReturn = pgTable("library_issue_return", {
  id: uuid("id").primaryKey().defaultRandom(),
  schoolId: uuid("school_id").notNull().references(() => schools.id),
  bookId: uuid("book_id").references(() => libraryBooks.id),
  borrowerType: varchar("borrower_type", { length: 50 }),
  studentId: uuid("student_id").references(() => students.id),
  teacherId: uuid("teacher_id").references(() => teachers.id),
  scannedBookBarcode: varchar("scanned_book_barcode", { length: 100 }),
  scannedUserBarcode: varchar("scanned_user_barcode", { length: 100 }),
  issueDate: timestamp("issue_date").notNull(),
  dueDate: timestamp("due_date").notNull(),
  returnDate: timestamp("return_date"),
  status: varchar("status", { length: 50 }),
  renewalCount: integer("renewal_count").default(0),
  issuedByUserProfileId: uuid("issued_by_user_profile_id").references(() => userProfiles.id),
  returnedByUserProfileId: uuid("returned_by_user_profile_id").references(() => userProfiles.id),
  remarks: text("remarks"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Library Fines
export const libraryFines = pgTable("library_fines", {
  id: uuid("id").primaryKey().defaultRandom(),
  schoolId: uuid("school_id").notNull().references(() => schools.id),
  issueReturnId: uuid("issue_return_id").references(() => libraryIssueReturn.id),
  studentId: uuid("student_id").references(() => students.id),
  teacherId: uuid("teacher_id").references(() => teachers.id),
  fineAmount: integer("fine_amount").notNull(),
  fineReason: varchar("fine_reason", { length: 255 }),
  daysOverdue: integer("days_overdue"),
  fineStatus: varchar("fine_status", { length: 50 }),
  paidAmount: integer("paid_amount").default(0),
  paidDate: timestamp("paid_date"),
  waivedAmount: integer("waived_amount").default(0),
  waivedReason: text("waived_reason"),
  waivedByUserProfileId: uuid("waived_by_user_profile_id").references(() => userProfiles.id),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Library Members
export const libraryMembers = pgTable("library_members", {
  id: uuid("id").primaryKey().defaultRandom(),
  schoolId: uuid("school_id").notNull().references(() => schools.id),
  memberType: varchar("member_type", { length: 50 }),
  studentId: uuid("student_id").references(() => students.id),
  teacherId: uuid("teacher_id").references(() => teachers.id),
  membershipNumber: varchar("membership_number", { length: 100 }),
  memberBarcode: varchar("member_barcode", { length: 100 }),
  membershipStartDate: timestamp("membership_start_date"),
  membershipExpiryDate: timestamp("membership_expiry_date"),
  maxBooksAllowed: integer("max_books_allowed").default(3),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Student Admissions table - Comprehensive admission details
export const studentAdmissions = pgTable("student_admissions", {
  id: uuid("id").primaryKey().defaultRandom(),
  schoolId: uuid("school_id").notNull().references(() => schools.id),
  studentId: uuid("student_id").references(() => students.id), // Linked after admission is approved
  admissionNumber: varchar("admission_number", { length: 50 }).unique(),
  academicYear: varchar("academic_year", { length: 10 }).notNull(),
  admittingClass: varchar("admitting_class", { length: 50 }).notNull(),
  admittingSection: varchar("admitting_section", { length: 10 }),
  
  // Student Details
  studentName: varchar("student_name", { length: 255 }).notNull(),
  dateOfBirth: timestamp("date_of_birth"),
  gender: varchar("gender", { length: 20 }),
  bloodGroup: varchar("blood_group", { length: 10 }),
  studentPhoto: text("student_photo"), // Base64 or file path
  studentAadhaarNo: varchar("student_aadhaar_no", { length: 12 }),
  apaarNo: varchar("apaar_no", { length: 50 }), // Academic Passport for Admission and Assessment Record
  udiseNo: varchar("udise_no", { length: 50 }), // Unified District Information System for Education
  
  // Parent/Guardian Details
  fatherName: varchar("father_name", { length: 255 }),
  fatherPhone: varchar("father_phone", { length: 15 }),
  fatherOccupation: varchar("father_occupation", { length: 100 }),
  fatherSalaryPerAnnum: decimal("father_salary_per_annum", { precision: 12, scale: 2 }),
  motherName: varchar("mother_name", { length: 255 }),
  motherPhone: varchar("mother_phone", { length: 15 }),
  motherOccupation: varchar("mother_occupation", { length: 100 }),
  guardianName: varchar("guardian_name", { length: 255 }),
  guardianPhone: varchar("guardian_phone", { length: 15 }),
  guardianRelation: varchar("guardian_relation", { length: 50 }),
  
  // Address Details
  permanentAddress: text("permanent_address"),
  currentAddress: text("current_address"),
  city: varchar("city", { length: 100 }),
  state: varchar("state", { length: 100 }),
  pincode: varchar("pincode", { length: 10 }),
  
  // Additional Information
  communityCategory: varchar("community_category", { length: 50 }), // General, OBC, SC, ST, etc.
  communityCertificate: text("community_certificate"), // File path or base64
  religion: varchar("religion", { length: 50 }),
  caste: varchar("caste", { length: 100 }),
  isOnlyChild: boolean("is_only_child").default(false),
  numberOfSiblings: integer("number_of_siblings").default(0),
  
  // Previous School Details
  previousSchoolName: varchar("previous_school_name", { length: 255 }),
  previousSchoolBoard: varchar("previous_school_board", { length: 100 }),
  lastClassAttended: varchar("last_class_attended", { length: 50 }),
  transferCertificateNo: varchar("transfer_certificate_no", { length: 100 }),
  
  // Medical Information
  medicalConditions: text("medical_conditions"),
  allergies: text("allergies"),
  bloodGroupCertificate: text("blood_group_certificate"),
  
  // Admission Status
  admissionStatus: varchar("admission_status", { length: 50 }).default('pending'), // pending, approved, rejected
  admissionDate: timestamp("admission_date"),
  approvedBy: uuid("approved_by").references(() => userProfiles.id),
  remarks: text("remarks"),
  
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// CBSE Registrations table - For 9th and 11th standard
export const cbseRegistrations = pgTable("cbse_registrations", {
  id: uuid("id").primaryKey().defaultRandom(),
  schoolId: uuid("school_id").notNull().references(() => schools.id),
  studentId: uuid("student_id").notNull().references(() => students.id),
  admissionId: uuid("admission_id").references(() => studentAdmissions.id), // Link to admission data
  
  // CBSE Registration Details
  registrationNumber: varchar("registration_number", { length: 50 }).unique(),
  academicYear: varchar("academic_year", { length: 10 }).notNull(),
  registrationClass: varchar("registration_class", { length: 10 }).notNull(), // 9 or 11
  registrationDate: timestamp("registration_date").defaultNow(),
  
  // Student Details (auto-filled from admission)
  studentName: varchar("student_name", { length: 255 }).notNull(),
  dateOfBirth: timestamp("date_of_birth").notNull(),
  gender: varchar("gender", { length: 20 }).notNull(),
  studentPhoto: text("student_photo"),
  studentAadhaarNo: varchar("student_aadhaar_no", { length: 12 }),
  apaarNo: varchar("apaar_no", { length: 50 }),
  udiseNo: varchar("udise_no", { length: 50 }),
  
  // Parent Details (auto-filled from admission)
  fatherName: varchar("father_name", { length: 255 }).notNull(),
  fatherPhone: varchar("father_phone", { length: 15 }),
  fatherOccupation: varchar("father_occupation", { length: 100 }),
  fatherSalaryPerAnnum: decimal("father_salary_per_annum", { precision: 12, scale: 2 }),
  motherName: varchar("mother_name", { length: 255 }).notNull(),
  motherPhone: varchar("mother_phone", { length: 15 }),
  
  // Category & Community (auto-filled from admission)
  communityCategory: varchar("community_category", { length: 50 }).notNull(),
  communityCertificate: text("community_certificate"),
  religion: varchar("religion", { length: 50 }),
  caste: varchar("caste", { length: 100 }),
  isOnlyChild: boolean("is_only_child").default(false),
  
  // CBSE Specific Fields
  cbseSchoolCode: varchar("cbse_school_code", { length: 50 }),
  previousSchoolName: varchar("previous_school_name", { length: 255 }),
  previousBoard: varchar("previous_board", { length: 100 }),
  class8Percentage: decimal("class_8_percentage", { precision: 5, scale: 2 }), // For Class 9
  class10BoardRollNo: varchar("class_10_board_roll_no", { length: 50 }), // For Class 11
  class10Percentage: decimal("class_10_percentage", { precision: 5, scale: 2 }), // For Class 11
  
  // Subject Selection (for Class 11)
  streamSelected: varchar("stream_selected", { length: 50 }), // Science, Commerce, Arts
  subjectsSelected: jsonb("subjects_selected"), // Array of subject codes
  
  // Documents
  birthCertificate: text("birth_certificate"),
  transferCertificate: text("transfer_certificate"),
  casteCertificate: text("caste_certificate"),
  class8MarkSheet: text("class_8_mark_sheet"),
  class10MarkSheet: text("class_10_mark_sheet"),
  
  // Registration Status
  registrationStatus: varchar("registration_status", { length: 50 }).default('pending'), // pending, submitted, approved, rejected
  submittedToCBSE: boolean("submitted_to_cbse").default(false),
  cbseSubmissionDate: timestamp("cbse_submission_date"),
  cbseApprovalDate: timestamp("cbse_approval_date"),
  cbseRollNumber: varchar("cbse_roll_number", { length: 50 }),
  
  remarks: text("remarks"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// CBSE Document Tracking - Track pending documents per student
export const cbseDocumentTracking = pgTable("cbse_document_tracking", {
  id: uuid("id").primaryKey().defaultRandom(),
  schoolId: uuid("school_id").notNull().references(() => schools.id),
  registrationId: uuid("registration_id").notNull().references(() => cbseRegistrations.id),
  studentId: uuid("student_id").notNull().references(() => students.id),
  documentType: varchar("document_type", { length: 100 }).notNull(), // birth_certificate, transfer_certificate, etc
  documentStatus: varchar("document_status", { length: 50 }).default("pending"), // pending, uploaded, verified, rejected
  documentUrl: text("document_url"),
  uploadedAt: timestamp("uploaded_at"),
  verifiedAt: timestamp("verified_at"),
  verifiedByUserProfileId: uuid("verified_by_user_profile_id").references(() => userProfiles.id),
  rejectionReason: text("rejection_reason"),
  reminderSent: boolean("reminder_sent").default(false), // NEW: Reminder system
  lastReminderSent: timestamp("last_reminder_sent"), // NEW
  reminderCount: integer("reminder_count").default(0), // NEW
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Document Automation Watermark Templates
export const documentWatermarkTemplates = pgTable("document_watermark_templates", {
  id: uuid("id").primaryKey().defaultRandom(),
  schoolId: uuid("school_id").notNull().references(() => schools.id),
  templateName: varchar("template_name", { length: 255 }).notNull(),
  watermarkType: varchar("watermark_type", { length: 50 }).notNull(), // text, image
  watermarkText: text("watermark_text"), // For text watermarks
  watermarkImageUrl: text("watermark_image_url"), // NEW: For image watermarks
  fontSize: integer("font_size").default(36),
  opacity: decimal("opacity", { precision: 3, scale: 2 }).default('0.30'),
  rotation: integer("rotation").default(45), // Rotation angle
  position: varchar("position", { length: 50 }).default("diagonal"), // diagonal, top, bottom, center
  color: varchar("color", { length: 20 }).default("#000000"),
  isDefault: boolean("is_default").default(false),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Document School Header/Footer Templates
export const documentHeaderFooterTemplates = pgTable("document_header_footer_templates", {
  id: uuid("id").primaryKey().defaultRandom(),
  schoolId: uuid("school_id").notNull().references(() => schools.id),
  templateName: varchar("template_name", { length: 255 }).notNull(),
  headerLogoUrl: text("header_logo_url"),
  headerText: text("header_text"), // School name, address, etc
  footerText: text("footer_text"), // Copyright, contact info, etc
  headerHeight: integer("header_height").default(100), // in pixels
  footerHeight: integer("footer_height").default(60),
  headerBackgroundColor: varchar("header_background_color", { length: 20 }),
  footerBackgroundColor: varchar("footer_background_color", { length: 20 }),
  isDefault: boolean("is_default").default(false),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Invigilation Duty Allocation System Tables

// Exam Schedule table
export const examSchedule = pgTable("exam_schedule", {
  id: uuid("id").primaryKey().defaultRandom(),
  schoolId: uuid("school_id").notNull().references(() => schools.id),
  day: varchar("day", { length: 20 }),
  examDate: timestamp("exam_date").notNull(),
  subject: varchar("subject", { length: 100 }).notNull(),
  grade: varchar("grade", { length: 50 }).notNull(),
  roomsAvailable: text("rooms_available"), // Comma-separated list of rooms
  academicYear: varchar("academic_year", { length: 10 }),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Exam Rooms table
export const examRooms = pgTable("exam_rooms", {
  id: uuid("id").primaryKey().defaultRandom(),
  schoolId: uuid("school_id").notNull().references(() => schools.id),
  roomName: varchar("room_name", { length: 100 }).notNull(),
  capacity: integer("capacity").default(40),
  notes: text("notes"),
  isAvailable: boolean("is_available").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Duty Allocation table
export const dutyAllocation = pgTable("duty_allocation", {
  id: uuid("id").primaryKey().defaultRandom(),
  schoolId: uuid("school_id").notNull().references(() => schools.id),
  teacherId: uuid("teacher_id").notNull().references(() => teachers.id),
  examScheduleId: uuid("exam_schedule_id").references(() => examSchedule.id),
  examDate: timestamp("exam_date").notNull(),
  roomAssigned: varchar("room_assigned", { length: 100 }),
  dutyType: varchar("duty_type", { length: 50 }), // invigilation, relief, etc.
  status: varchar("status", { length: 50 }).default('assigned'), // assigned, completed, cancelled
  totalDutyAssignments: integer("total_duty_assignments").default(0), // TDA count
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Exemption Record table
export const exemptionRecord = pgTable("exemption_record", {
  id: uuid("id").primaryKey().defaultRandom(),
  schoolId: uuid("school_id").notNull().references(() => schools.id),
  teacherId: uuid("teacher_id").notNull().references(() => teachers.id),
  teacherName: varchar("teacher_name", { length: 255 }),
  subject: varchar("subject", { length: 100 }),
  exemptedExamDate: timestamp("exempted_exam_date").notNull(),
  grade: varchar("grade", { length: 50 }),
  reason: text("reason").default('Subject teacher exemption'),
  createdAt: timestamp("created_at").defaultNow(),
});

// Teacher Duty Status table (extends teachers for invigilation-specific data)
export const teacherDutyStatus = pgTable("teacher_duty_status", {
  id: uuid("id").primaryKey().defaultRandom(),
  schoolId: uuid("school_id").notNull().references(() => schools.id),
  teacherId: uuid("teacher_id").notNull().references(() => teachers.id),
  status: varchar("status", { length: 50 }).default('ACTIVE'), // ACTIVE, SICK, ON-LEAVE
  dutyFactor: decimal("duty_factor", { precision: 3, scale: 2 }).default('1.00'), // 0.0 to 1.0
  effectiveFrom: timestamp("effective_from"),
  effectiveTo: timestamp("effective_to"),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Invigilation Settings table (multi-tenancy config)
export const invigilationSettings = pgTable("invigilation_settings", {
  id: uuid("id").primaryKey().defaultRandom(),
  schoolId: uuid("school_id").notNull().references(() => schools.id),
  autoExemptSubjectTeachers: boolean("auto_exempt_subject_teachers").default(true),
  maxDutiesPerTeacher: integer("max_duties_per_teacher").default(0), // 0 = no limit
  sickDutyFactor: decimal("sick_duty_factor", { precision: 3, scale: 2 }).default('0.50'),
  onLeaveDutyFactor: decimal("on_leave_duty_factor", { precision: 3, scale: 2 }).default('0.00'),
  minTeachersPerRoom: integer("min_teachers_per_room").default(2),
  allowOverlappingDuties: boolean("allow_overlapping_duties").default(false),
  notificationEnabled: boolean("notification_enabled").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Student Distribution System Tables

// Class Data table
export const classData = pgTable("class_data", {
  id: uuid("id").primaryKey().defaultRandom(),
  schoolId: uuid("school_id").notNull().references(() => schools.id),
  classId: uuid("class_id").references(() => classes.id),
  className: varchar("class_name", { length: 50 }).notNull(), // IX, X, etc.
  section: varchar("section", { length: 10 }).notNull(),
  startRollNo: integer("start_roll_no").notNull(),
  endRollNo: integer("end_roll_no").notNull(),
  totalStudents: integer("total_students").notNull(),
  notes: text("notes"),
  academicYear: varchar("academic_year", { length: 10 }),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Student Distribution table
export const studentDistribution = pgTable("student_distribution", {
  id: uuid("id").primaryKey().defaultRandom(),
  schoolId: uuid("school_id").notNull().references(() => schools.id),
  examScheduleId: uuid("exam_schedule_id").references(() => examSchedule.id),
  roomName: varchar("room_name", { length: 100 }).notNull(),
  roomCapacity: integer("room_capacity"),
  className: varchar("class_name", { length: 50 }),
  section: varchar("section", { length: 10 }),
  rollNumbers: text("roll_numbers"), // e.g., "1-20, 25-30"
  studentCount: integer("student_count"),
  notes: text("notes"),
  distributionDate: timestamp("distribution_date"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Invigilator Reference table (for invigilators to see student distribution)
export const invigilatorReference = pgTable("invigilator_reference", {
  id: uuid("id").primaryKey().defaultRandom(),
  schoolId: uuid("school_id").notNull().references(() => schools.id),
  examScheduleId: uuid("exam_schedule_id").references(() => examSchedule.id),
  roomName: varchar("room_name", { length: 100 }).notNull(),
  studentsByClass: jsonb("students_by_class"), // {class: "IX A1", rollNumbers: "1-20", count: 20}
  totalCount: integer("total_count"),
  invigilatorNames: text("invigilator_names"), // Comma-separated
  createdAt: timestamp("created_at").defaultNow(),
});

// Class Teacher Reference table (for class teachers to track their students)
export const classTeacherReference = pgTable("class_teacher_reference", {
  id: uuid("id").primaryKey().defaultRandom(),
  schoolId: uuid("school_id").notNull().references(() => schools.id),
  examScheduleId: uuid("exam_schedule_id").references(() => examSchedule.id),
  className: varchar("class_name", { length: 50 }).notNull(),
  section: varchar("section", { length: 10 }).notNull(),
  roomAssignments: jsonb("room_assignments"), // Array of {room, rollNumbers, count}
  totalStudents: integer("total_students"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Distribution Settings table (multi-tenancy config)
export const distributionSettings = pgTable("distribution_settings", {
  id: uuid("id").primaryKey().defaultRandom(),
  schoolId: uuid("school_id").notNull().references(() => schools.id),
  mixStrategy: varchar("mix_strategy", { length: 50 }).default('STRATIFIED'), // STRATIFIED, BY_CLASS, RANDOM
  targetPerRoom: integer("target_per_room").default(39),
  mixingPattern: varchar("mixing_pattern", { length: 50 }).default('IX_X'), // IX_X, NONE, CUSTOM
  useGaps: boolean("use_gaps").default(true),
  distributionMode: varchar("distribution_mode", { length: 50 }).default('HALF_ROLL_SPREAD'), // HALF_ROLL_SPREAD, GROUPS_OF_THREE, BALANCED
  autoAssignRooms: boolean("auto_assign_rooms").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// =================================================================
// STUDENT BEHAVIORAL TRACKER SYSTEM TABLES
// =================================================================

// Student Behavior Master - tracks overall behavior metrics per student
export const studentBehaviorMaster = pgTable("student_behavior_master", {
  id: serial("id").primaryKey(),
  schoolId: varchar("school_id").notNull(),
  studentId: varchar("student_id").notNull(),
  studentName: varchar("student_name", { length: 255 }).notNull(),
  class: varchar("class", { length: 50 }).notNull(),
  section: varchar("section", { length: 10 }).notNull(),
  parentPhone: varchar("parent_phone", { length: 20 }),
  behaviorScore: integer("behavior_score").default(85).notNull(), // 0-100 scale
  incidentCount: integer("incident_count").default(0).notNull(),
  positivePoints: integer("positive_points").default(0).notNull(),
  riskLevel: varchar("risk_level", { length: 20 }).default('GREEN').notNull(), // GREEN, YELLOW, RED
  lastIncident: timestamp("last_incident"),
  lastAchievement: timestamp("last_achievement"),
  counselorAssigned: varchar("counselor_assigned", { length: 255 }),
  notes: text("notes"),
  academicYear: varchar("academic_year", { length: 20 }).notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Incident Records - tracks all behavior incidents
export const incidentRecords = pgTable("incident_records", {
  id: serial("id").primaryKey(),
  schoolId: varchar("school_id").notNull(),
  incidentId: varchar("incident_id").notNull().unique(), // INC + timestamp
  incidentDate: timestamp("incident_date").notNull(),
  incidentTime: varchar("incident_time", { length: 10 }).notNull(),
  studentId: varchar("student_id").notNull(),
  studentName: varchar("student_name", { length: 255 }).notNull(),
  class: varchar("class", { length: 50 }).notNull(),
  incidentType: varchar("incident_type", { length: 50 }).notNull(), // CLASSROOM_DISRUPTION, BULLYING_PHYSICAL, etc.
  severity: varchar("severity", { length: 20 }).notNull(), // MINOR, MODERATE, MAJOR, SEVERE
  location: varchar("location", { length: 50 }).notNull(), // CLASSROOM, PLAYGROUND, etc.
  description: text("description").notNull(),
  witnesses: text("witnesses"),
  reportedBy: varchar("reported_by", { length: 255 }).notNull(),
  actionTaken: text("action_taken"),
  parentContacted: varchar("parent_contacted", { length: 10 }).default('NO'),
  counselorReferred: varchar("counselor_referred", { length: 10 }).default('NO'),
  principalInformed: varchar("principal_informed", { length: 10 }).default('NO'),
  status: varchar("status", { length: 20 }).default('RECORDED'), // RECORDED, UNDER_REVIEW, RESOLVED
  followUp: text("follow_up"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Positive Behavior Log - tracks positive behaviors and achievements
export const positiveBehaviorLog = pgTable("positive_behavior_log", {
  id: serial("id").primaryKey(),
  schoolId: varchar("school_id").notNull(),
  achievementId: varchar("achievement_id").notNull().unique(), // ACH + timestamp
  achievementDate: timestamp("achievement_date").notNull(),
  studentId: varchar("student_id").notNull(),
  studentName: varchar("student_name", { length: 255 }).notNull(),
  class: varchar("class", { length: 50 }).notNull(),
  achievementType: varchar("achievement_type", { length: 50 }).notNull(), // ACADEMIC_EXCELLENCE, HELPING_CLASSMATES, etc.
  description: text("description").notNull(),
  pointsAwarded: integer("points_awarded").notNull(), // 5, 10, 15, 20, 25
  awardedBy: varchar("awarded_by", { length: 255 }).notNull(),
  awardLevel: varchar("award_level", { length: 50 }), // CLASS_RECOGNITION, GRADE_RECOGNITION, etc.
  certificateIssued: varchar("certificate_issued", { length: 10 }).default('NO'),
  publicRecognition: varchar("public_recognition", { length: 10 }).default('NO'),
  createdAt: timestamp("created_at").defaultNow(),
});

// Behavior Notifications - tracks parent communications
export const behaviorNotifications = pgTable("behavior_notifications", {
  id: serial("id").primaryKey(),
  schoolId: varchar("school_id").notNull(),
  notificationId: varchar("notification_id").notNull().unique(), // BINC/BACH + timestamp
  studentId: varchar("student_id").notNull(),
  studentName: varchar("student_name", { length: 255 }).notNull(),
  notificationType: varchar("notification_type", { length: 50 }).notNull(), // INCIDENT, ACHIEVEMENT, BULLYING, etc.
  recipientPhone: varchar("recipient_phone", { length: 20 }).notNull(),
  messageText: text("message_text").notNull(),
  status: varchar("status", { length: 20 }).default('PENDING'), // PENDING, SENT, FAILED
  sentTime: timestamp("sent_time"),
  channel: varchar("channel", { length: 20 }).default('WHATSAPP'), // WHATSAPP, SMS, EMAIL
  referenceId: varchar("reference_id", { length: 50 }), // Links to incident_id or achievement_id
  createdAt: timestamp("created_at").defaultNow(),
});

// Counselor Referrals - tracks counselor referrals for students
export const counselorReferrals = pgTable("counselor_referrals", {
  id: serial("id").primaryKey(),
  schoolId: varchar("school_id").notNull(),
  referralId: varchar("referral_id").notNull().unique(), // REF + timestamp
  studentId: varchar("student_id").notNull(),
  studentName: varchar("student_name", { length: 255 }).notNull(),
  class: varchar("class", { length: 50 }).notNull(),
  incidentId: varchar("incident_id"), // Links to incident_records
  referralType: varchar("referral_type", { length: 50 }).notNull(), // BEHAVIORAL, EMOTIONAL, ACADEMIC, SOCIAL
  urgency: varchar("urgency", { length: 20 }).notNull(), // LOW, MEDIUM, HIGH, CRITICAL
  referralDate: timestamp("referral_date").notNull(),
  appointmentDate: timestamp("appointment_date"),
  status: varchar("status", { length: 20 }).default('PENDING'), // PENDING, SCHEDULED, COMPLETED, CANCELLED
  referredBy: varchar("referred_by", { length: 255 }).notNull(),
  counselorAssigned: varchar("counselor_assigned", { length: 255 }),
  notes: text("notes"),
  outcome: text("outcome"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Parent Conferences - tracks parent-teacher conferences
export const parentConferences = pgTable("parent_conferences", {
  id: serial("id").primaryKey(),
  schoolId: varchar("school_id").notNull(),
  conferenceId: varchar("conference_id").notNull().unique(), // CONF + timestamp
  studentId: varchar("student_id").notNull(),
  studentName: varchar("student_name", { length: 255 }).notNull(),
  incidentId: varchar("incident_id"), // Links to incident_records
  conferenceDate: timestamp("conference_date").notNull(),
  attendees: text("attendees").notNull(), // Comma-separated list
  agenda: text("agenda").notNull(),
  outcomes: text("outcomes"),
  actionPlan: text("action_plan"),
  followUpDate: timestamp("follow_up_date"),
  status: varchar("status", { length: 20 }).default('SCHEDULED'), // SCHEDULED, COMPLETED, CANCELLED
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Behavior Analytics - tracks daily/periodic behavior analytics
export const behaviorAnalytics = pgTable("behavior_analytics", {
  id: serial("id").primaryKey(),
  schoolId: varchar("school_id").notNull(),
  date: timestamp("date").notNull(),
  totalStudents: integer("total_students").notNull(),
  avgBehaviorScore: decimal("avg_behavior_score", { precision: 5, scale: 2 }),
  incidentsCount: integer("incidents_count").default(0),
  achievementsCount: integer("achievements_count").default(0),
  greenLevelCount: integer("green_level_count").default(0),
  yellowLevelCount: integer("yellow_level_count").default(0),
  redLevelCount: integer("red_level_count").default(0),
  counselorReferrals: integer("counselor_referrals").default(0),
  bullyingIncidents: integer("bullying_incidents").default(0),
  createdAt: timestamp("created_at").defaultNow(),
});

// Recognition Awards - tracks awards given to students
export const recognitionAwards = pgTable("recognition_awards", {
  id: serial("id").primaryKey(),
  schoolId: varchar("school_id").notNull(),
  awardId: varchar("award_id").notNull().unique(), // AWD + timestamp
  studentId: varchar("student_id").notNull(),
  studentName: varchar("student_name", { length: 255 }).notNull(),
  awardType: varchar("award_type", { length: 100 }).notNull(), // STAR_STUDENT, KINDNESS_AWARD, etc.
  awardDate: timestamp("award_date").notNull(),
  criteriaMet: text("criteria_met").notNull(),
  pointsValue: integer("points_value").notNull(),
  certificateIssued: varchar("certificate_issued", { length: 10 }).default('NO'),
  publicRecognition: varchar("public_recognition", { length: 10 }).default('NO'),
  awardedBy: varchar("awarded_by", { length: 255 }).notNull(),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Safety Plans - tracks safety plans for at-risk students
export const safetyPlans = pgTable("safety_plans", {
  id: serial("id").primaryKey(),
  schoolId: varchar("school_id").notNull(),
  safetyPlanId: varchar("safety_plan_id").notNull().unique(), // SAFE + timestamp
  studentId: varchar("student_id").notNull(),
  studentName: varchar("student_name", { length: 255 }).notNull(),
  class: varchar("class", { length: 50 }).notNull(),
  incidentId: varchar("incident_id"), // Links to incident_records
  createdDate: timestamp("created_date").notNull(),
  status: varchar("status", { length: 20 }).default('ACTIVE'), // ACTIVE, COMPLETED, INACTIVE
  supervisionPlan: text("supervision_plan").notNull(),
  seatingArrangement: text("seating_arrangement"),
  counselorCheckin: varchar("counselor_checkin", { length: 50 }), // DAILY, WEEKLY, BI-WEEKLY
  reportingSystem: text("reporting_system"),
  createdBy: varchar("created_by", { length: 255 }).notNull(),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Behavior Settings - multi-tenancy configuration for behavior tracking
export const behaviorSettings = pgTable("behavior_settings", {
  id: serial("id").primaryKey(),
  schoolId: varchar("school_id").notNull().unique(),
  // Score Settings
  minorIncidentPoints: integer("minor_incident_points").default(-2),
  moderateIncidentPoints: integer("moderate_incident_points").default(-5),
  majorIncidentPoints: integer("major_incident_points").default(-10),
  severeIncidentPoints: integer("severe_incident_points").default(-15),
  // Risk Level Thresholds
  greenThreshold: integer("green_threshold").default(85), // >= 85 is GREEN
  yellowThreshold: integer("yellow_threshold").default(70), // 70-84 is YELLOW, <70 is RED
  // Auto-notification Settings
  autoNotifyParentMajor: boolean("auto_notify_parent_major").default(true),
  autoNotifyParentSevere: boolean("auto_notify_parent_severe").default(true),
  autoReferCounselorSevere: boolean("auto_refer_counselor_severe").default(true),
  autoInformPrincipalSevere: boolean("auto_inform_principal_severe").default(true),
  // Bullying Settings
  enableAntiBullying: boolean("enable_anti_bullying").default(true),
  bullyingAutoReferCounselor: boolean("bullying_auto_refer_counselor").default(true),
  bullyingSafetyPlanRequired: boolean("bullying_safety_plan_required").default(true),
  // Positive Behavior Settings
  enablePositivePoints: boolean("enable_positive_points").default(true),
  certificateThreshold: integer("certificate_threshold").default(50), // Points needed for certificate
  publicRecognitionThreshold: integer("public_recognition_threshold").default(100),
  // General Settings
  academicYear: varchar("academic_year", { length: 20 }).notNull(),
  enableWhatsappNotifications: boolean("enable_whatsapp_notifications").default(true),
  enableEmailNotifications: boolean("enable_email_notifications").default(false),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Insert schemas
export const insertSchoolSchema = createInsertSchema(schools).omit({ id: true, createdAt: true, updatedAt: true });
export const insertUserProfileSchema = createInsertSchema(userProfiles).omit({ id: true, createdAt: true, updatedAt: true });
export const insertStudentSchema = createInsertSchema(students).omit({ id: true });
export const insertAttendanceSchema = createInsertSchema(attendance).omit({ id: true, createdAt: true });
export const insertStudentAdmissionSchema = createInsertSchema(studentAdmissions).omit({ id: true, createdAt: true, updatedAt: true });
export const insertCBSERegistrationSchema = createInsertSchema(cbseRegistrations).omit({ id: true, createdAt: true, updatedAt: true });
export const insertExamScheduleSchema = createInsertSchema(examSchedule).omit({ id: true, createdAt: true, updatedAt: true });
export const insertExamRoomSchema = createInsertSchema(examRooms).omit({ id: true, createdAt: true, updatedAt: true });
export const insertDutyAllocationSchema = createInsertSchema(dutyAllocation).omit({ id: true, createdAt: true, updatedAt: true });
export const insertClassDataSchema = createInsertSchema(classData).omit({ id: true, createdAt: true, updatedAt: true });
export const insertStudentDistributionSchema = createInsertSchema(studentDistribution).omit({ id: true, createdAt: true, updatedAt: true });
export const insertStudentBehaviorMasterSchema = createInsertSchema(studentBehaviorMaster).omit({ id: true, createdAt: true, updatedAt: true });
export const insertIncidentRecordSchema = createInsertSchema(incidentRecords).omit({ id: true, createdAt: true, updatedAt: true });
export const insertPositiveBehaviorLogSchema = createInsertSchema(positiveBehaviorLog).omit({ id: true, createdAt: true });
export const insertBehaviorNotificationSchema = createInsertSchema(behaviorNotifications).omit({ id: true, createdAt: true });
export const insertCounselorReferralSchema = createInsertSchema(counselorReferrals).omit({ id: true, createdAt: true, updatedAt: true });
export const insertParentConferenceSchema = createInsertSchema(parentConferences).omit({ id: true, createdAt: true, updatedAt: true });
export const insertBehaviorAnalyticsSchema = createInsertSchema(behaviorAnalytics).omit({ id: true, createdAt: true });
export const insertRecognitionAwardSchema = createInsertSchema(recognitionAwards).omit({ id: true, createdAt: true });
export const insertSafetyPlanSchema = createInsertSchema(safetyPlans).omit({ id: true, createdAt: true, updatedAt: true });

// Types
export type School = typeof schools.$inferSelect;
export type InsertSchool = z.infer<typeof insertSchoolSchema>;
export type UserProfile = typeof userProfiles.$inferSelect;
export type InsertUserProfile = z.infer<typeof insertUserProfileSchema>;
export type Teacher = typeof teachers.$inferSelect;
export type Class = typeof classes.$inferSelect;
export type Student = typeof students.$inferSelect;
export type InsertStudent = z.infer<typeof insertStudentSchema>;
export type Subject = typeof subjects.$inferSelect;
export type Attendance = typeof attendance.$inferSelect;
export type InsertAttendance = z.infer<typeof insertAttendanceSchema>;

export type AttendanceRecord = typeof attendanceRecords.$inferSelect;
export type AttendanceGpsLog = typeof attendanceGpsLogs.$inferSelect;
export type PrincipalAlert = typeof principalAlerts.$inferSelect;
export type AttendanceDashboardData = typeof attendanceDashboardData.$inferSelect;
export type GpsAttendanceSession = typeof gpsAttendanceSessions.$inferSelect;
export type BarcodeAttendanceSession = typeof barcodeAttendanceSessions.$inferSelect;

export const insertAttendanceRecordSchema = createInsertSchema(attendanceRecords).omit({ id: true, createdAt: true });
export type InsertAttendanceRecord = z.infer<typeof insertAttendanceRecordSchema>;

export const insertAttendanceGpsLogSchema = createInsertSchema(attendanceGpsLogs).omit({ id: true, createdAt: true });
export type InsertAttendanceGpsLog = z.infer<typeof insertAttendanceGpsLogSchema>;

export const insertPrincipalAlertSchema = createInsertSchema(principalAlerts).omit({ id: true, createdAt: true });
export type InsertPrincipalAlert = z.infer<typeof insertPrincipalAlertSchema>;

export const insertGpsAttendanceSessionSchema = createInsertSchema(gpsAttendanceSessions).omit({ id: true, createdAt: true });
export type InsertGpsAttendanceSession = z.infer<typeof insertGpsAttendanceSessionSchema>;

export type Timetable = typeof timetable.$inferSelect;
export type FeeStructure = typeof feeStructure.$inferSelect;
export type FeePayment = typeof feePayments.$inferSelect;
export type PaymentFailure = typeof paymentFailures.$inferSelect;
export type PaymentLink = typeof paymentLinks.$inferSelect;
export type Refund = typeof refunds.$inferSelect;
export type ReconciliationRecord = typeof reconciliationRecords.$inferSelect;
export type TriPartyVerificationLog = typeof triPartyVerificationLogs.$inferSelect;
export type PaymentGatewayTransaction = typeof paymentGatewayTransactions.$inferSelect;

export const insertPaymentFailureSchema = createInsertSchema(paymentFailures).omit({ id: true, createdAt: true });
export type InsertPaymentFailure = z.infer<typeof insertPaymentFailureSchema>;

export const insertPaymentLinkSchema = createInsertSchema(paymentLinks).omit({ id: true, createdAt: true });
export type InsertPaymentLink = z.infer<typeof insertPaymentLinkSchema>;

export const insertRefundSchema = createInsertSchema(refunds).omit({ id: true, createdAt: true });
export type InsertRefund = z.infer<typeof insertRefundSchema>;

export const insertReconciliationRecordSchema = createInsertSchema(reconciliationRecords).omit({ id: true, createdAt: true });
export type InsertReconciliationRecord = z.infer<typeof insertReconciliationRecordSchema>;

export const insertPaymentGatewayTransactionSchema = createInsertSchema(paymentGatewayTransactions).omit({ id: true, createdAt: true, updatedAt: true });
export type InsertPaymentGatewayTransaction = z.infer<typeof insertPaymentGatewayTransactionSchema>;

export type StudentAdmission = typeof studentAdmissions.$inferSelect;
export type InsertStudentAdmission = z.infer<typeof insertStudentAdmissionSchema>;
export type CBSERegistration = typeof cbseRegistrations.$inferSelect;
export type InsertCBSERegistration = z.infer<typeof insertCBSERegistrationSchema>;
export type ExamSchedule = typeof examSchedule.$inferSelect;
export type InsertExamSchedule = z.infer<typeof insertExamScheduleSchema>;
export type ExamRoom = typeof examRooms.$inferSelect;
export type InsertExamRoom = z.infer<typeof insertExamRoomSchema>;
export type DutyAllocation = typeof dutyAllocation.$inferSelect;
export type InsertDutyAllocation = z.infer<typeof insertDutyAllocationSchema>;
export type TeacherDutyStatus = typeof teacherDutyStatus.$inferSelect;
export type ExemptionRecord = typeof exemptionRecord.$inferSelect;
export type InvigilationSettings = typeof invigilationSettings.$inferSelect;
export type ClassData = typeof classData.$inferSelect;
export type InsertClassData = z.infer<typeof insertClassDataSchema>;
export type StudentDistribution = typeof studentDistribution.$inferSelect;
export type InsertStudentDistribution = z.infer<typeof insertStudentDistributionSchema>;
export type InvigilatorReference = typeof invigilatorReference.$inferSelect;
export type ClassTeacherReference = typeof classTeacherReference.$inferSelect;
export type DistributionSettings = typeof distributionSettings.$inferSelect;
export type StudentBehaviorMaster = typeof studentBehaviorMaster.$inferSelect;
export type InsertStudentBehaviorMaster = z.infer<typeof insertStudentBehaviorMasterSchema>;
export type IncidentRecord = typeof incidentRecords.$inferSelect;
export type InsertIncidentRecord = z.infer<typeof insertIncidentRecordSchema>;
export type PositiveBehaviorLog = typeof positiveBehaviorLog.$inferSelect;
export type InsertPositiveBehaviorLog = z.infer<typeof insertPositiveBehaviorLogSchema>;
export type BehaviorNotification = typeof behaviorNotifications.$inferSelect;
export type InsertBehaviorNotification = z.infer<typeof insertBehaviorNotificationSchema>;
export type CounselorReferral = typeof counselorReferrals.$inferSelect;
export type InsertCounselorReferral = z.infer<typeof insertCounselorReferralSchema>;
export type ParentConference = typeof parentConferences.$inferSelect;
export type InsertParentConference = z.infer<typeof insertParentConferenceSchema>;
export type BehaviorAnalytics = typeof behaviorAnalytics.$inferSelect;
export type InsertBehaviorAnalytics = z.infer<typeof insertBehaviorAnalyticsSchema>;
export type RecognitionAward = typeof recognitionAwards.$inferSelect;
export type InsertRecognitionAward = z.infer<typeof insertRecognitionAwardSchema>;
export type SafetyPlan = typeof safetyPlans.$inferSelect;
export type InsertSafetyPlan = z.infer<typeof insertSafetyPlanSchema>;
export type BehaviorSettings = typeof behaviorSettings.$inferSelect;

// ==================== SUBSCRIPTION & BILLING SYSTEM ====================
// For Super Admin to manage school subscriptions, pricing, invoices, and legal documents

// Subscription Plans - Pricing configurations
export const subscriptionPlans = pgTable("subscription_plans", {
  id: uuid("id").primaryKey().defaultRandom(),
  planName: varchar("plan_name", { length: 100 }).notNull(), // e.g., "Standard Plan", "Premium Plan"
  defaultPricePerStudent: decimal("default_price_per_student", { precision: 10, scale: 2 }).notNull().default("10.00"), // ₹10/student/month default
  description: text("description"),
  features: jsonb("features").$type<string[]>(), // List of features included
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// School Subscriptions - Each school's subscription record
export const schoolSubscriptions = pgTable("school_subscriptions", {
  id: uuid("id").primaryKey().defaultRandom(),
  schoolId: uuid("school_id").notNull().references(() => schools.id).unique(), // One subscription per school
  planId: uuid("plan_id").references(() => subscriptionPlans.id),
  
  // Pricing Configuration
  pricePerStudent: decimal("price_per_student", { precision: 10, scale: 2 }).notNull().default("10.00"), // Custom price (can be adjusted)
  isComplimentary: boolean("is_complimentary").default(false), // Free access for certain schools
  discountPercentage: decimal("discount_percentage", { precision: 5, scale: 2 }).default("0.00"), // Discount %
  
  // Subscription Status
  status: varchar("status", { length: 50 }).notNull().default("active"), // active, suspended, cancelled, trial
  startDate: timestamp("start_date").notNull(),
  endDate: timestamp("end_date"), // null = ongoing
  billingCycle: varchar("billing_cycle", { length: 20 }).default("monthly"), // monthly, quarterly, yearly
  
  // Student Count (for billing calculation)
  studentCount: integer("student_count").default(0), // Current student count
  lastStudentCountUpdate: timestamp("last_student_count_update"),
  
  // Billing Information
  totalMonthlyAmount: decimal("total_monthly_amount", { precision: 12, scale: 2 }), // studentCount * pricePerStudent - discount
  lastBillingDate: timestamp("last_billing_date"),
  nextBillingDate: timestamp("next_billing_date"),
  
  // Legal & Audit
  agreementSignedBy: uuid("agreement_signed_by").references(() => userProfiles.id), // Principal/Admin who signed
  agreementSignedDate: timestamp("agreement_signed_date"),
  termsAccepted: boolean("terms_accepted").default(false),
  
  // Notes (for bargaining, special arrangements)
  notes: text("notes"), // "Bargained from ₹10 to ₹8 per student due to bulk enrollment"
  
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Subscription Invoices - Generated invoices for audit & legal purposes
export const subscriptionInvoices = pgTable("subscription_invoices", {
  id: uuid("id").primaryKey().defaultRandom(),
  invoiceNumber: varchar("invoice_number", { length: 50 }).notNull().unique(), // INV-2025-001
  schoolId: uuid("school_id").notNull().references(() => schools.id),
  subscriptionId: uuid("subscription_id").notNull().references(() => schoolSubscriptions.id),
  
  // Invoice Details
  billingPeriodStart: timestamp("billing_period_start").notNull(),
  billingPeriodEnd: timestamp("billing_period_end").notNull(),
  invoiceDate: timestamp("invoice_date").notNull().defaultNow(),
  dueDate: timestamp("due_date").notNull(),
  
  // Pricing Breakdown
  studentCount: integer("student_count").notNull(),
  pricePerStudent: decimal("price_per_student", { precision: 10, scale: 2 }).notNull(),
  subtotal: decimal("subtotal", { precision: 12, scale: 2 }).notNull(), // studentCount * pricePerStudent
  discountPercentage: decimal("discount_percentage", { precision: 5, scale: 2 }).default("0.00"),
  discountAmount: decimal("discount_amount", { precision: 12, scale: 2 }).default("0.00"),
  taxPercentage: decimal("tax_percentage", { precision: 5, scale: 2 }).default("18.00"), // GST
  taxAmount: decimal("tax_amount", { precision: 12, scale: 2 }).default("0.00"),
  totalAmount: decimal("total_amount", { precision: 12, scale: 2 }).notNull(),
  
  // Payment Status
  status: varchar("status", { length: 50 }).default("pending"), // pending, paid, overdue, cancelled, complimentary
  paidDate: timestamp("paid_date"),
  paymentMethod: varchar("payment_method", { length: 50 }), // bank_transfer, cheque, online, upi
  paymentReference: varchar("payment_reference", { length: 255 }), // Transaction ID or cheque number
  
  // Legal Documents
  pdfPath: text("pdf_path"), // Path to generated PDF invoice
  sentToEmail: varchar("sent_to_email", { length: 255 }),
  sentDate: timestamp("sent_date"),
  
  // Audit Trail
  generatedBy: uuid("generated_by").references(() => userProfiles.id), // Super Admin who generated
  notes: text("notes"),
  
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Legal Documents - Terms, Agreements, Privacy Policy, etc.
export const subscriptionLegalDocuments = pgTable("subscription_legal_documents", {
  id: uuid("id").primaryKey().defaultRandom(),
  documentType: varchar("document_type", { length: 100 }).notNull(), // terms_of_service, subscription_agreement, privacy_policy, sla
  version: varchar("version", { length: 20 }).notNull(), // v1.0, v1.1
  title: varchar("title", { length: 255 }).notNull(),
  content: text("content").notNull(), // Full legal text
  
  // Document Status
  isActive: boolean("is_active").default(true),
  effectiveDate: timestamp("effective_date").notNull(),
  expiryDate: timestamp("expiry_date"),
  
  // File Storage
  pdfPath: text("pdf_path"), // Path to PDF version
  htmlPath: text("html_path"), // Path to HTML version
  
  // Metadata
  createdBy: uuid("created_by").references(() => userProfiles.id), // Super Admin
  approvedBy: uuid("approved_by").references(() => userProfiles.id),
  approvedDate: timestamp("approved_date"),
  
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// School Legal Acceptance - Track which schools accepted which legal documents
export const schoolLegalAcceptances = pgTable("school_legal_acceptances", {
  id: uuid("id").primaryKey().defaultRandom(),
  schoolId: uuid("school_id").notNull().references(() => schools.id),
  documentId: uuid("document_id").notNull().references(() => subscriptionLegalDocuments.id),
  
  // Acceptance Details
  acceptedBy: uuid("accepted_by").notNull().references(() => userProfiles.id), // Principal/Admin
  acceptedDate: timestamp("accepted_date").notNull().defaultNow(),
  ipAddress: varchar("ip_address", { length: 50 }),
  userAgent: text("user_agent"),
  
  // Digital Signature
  digitalSignature: text("digital_signature"), // Base64 signature image
  signedDocumentPath: text("signed_document_path"), // Path to signed PDF
  
  createdAt: timestamp("created_at").defaultNow(),
});

// Subscription Audit Log - Complete audit trail for IT/Financial audits
export const subscriptionAuditLog = pgTable("subscription_audit_log", {
  id: uuid("id").primaryKey().defaultRandom(),
  schoolId: uuid("school_id").references(() => schools.id),
  subscriptionId: uuid("subscription_id").references(() => schoolSubscriptions.id),
  
  // Action Details
  action: varchar("action", { length: 100 }).notNull(), // subscription_created, price_changed, discount_applied, complimentary_granted, invoice_generated, payment_received
  entity: varchar("entity", { length: 100 }).notNull(), // subscription, invoice, payment, pricing
  entityId: uuid("entity_id"), // ID of the affected entity
  
  // Change Tracking
  fieldChanged: varchar("field_changed", { length: 100 }), // e.g., "pricePerStudent", "discountPercentage"
  oldValue: text("old_value"),
  newValue: text("new_value"),
  
  // User & Context
  performedBy: uuid("performed_by").notNull().references(() => userProfiles.id), // Who made the change
  performedByRole: varchar("performed_by_role", { length: 50 }), // super_admin, principal
  reason: text("reason"), // "School requested discount due to financial constraints"
  
  // Audit Metadata
  ipAddress: varchar("ip_address", { length: 50 }),
  userAgent: text("user_agent"),
  sessionId: varchar("session_id", { length: 255 }),
  
  // Financial Impact
  financialImpact: decimal("financial_impact", { precision: 12, scale: 2 }), // +/- amount affected
  
  createdAt: timestamp("created_at").defaultNow(),
});

// Subscription Payment Records - Track all payments received
export const subscriptionPayments = pgTable("subscription_payments", {
  id: uuid("id").primaryKey().defaultRandom(),
  invoiceId: uuid("invoice_id").notNull().references(() => subscriptionInvoices.id),
  schoolId: uuid("school_id").notNull().references(() => schools.id),
  
  // Payment Details
  amount: decimal("amount", { precision: 12, scale: 2 }).notNull(),
  paymentDate: timestamp("payment_date").notNull().defaultNow(),
  paymentMethod: varchar("payment_method", { length: 50 }).notNull(), // bank_transfer, cheque, online, upi, cash
  
  // Payment References
  transactionId: varchar("transaction_id", { length: 255 }), // Bank/Gateway transaction ID
  chequeNumber: varchar("cheque_number", { length: 100 }),
  bankName: varchar("bank_name", { length: 255 }),
  upiId: varchar("upi_id", { length: 255 }),
  
  // Receipt
  receiptNumber: varchar("receipt_number", { length: 50 }).unique(), // REC-2025-001
  receiptPdfPath: text("receipt_pdf_path"), // Path to generated receipt PDF
  
  // Verification
  verifiedBy: uuid("verified_by").references(() => userProfiles.id), // Super Admin who verified
  verifiedDate: timestamp("verified_date"),
  status: varchar("status", { length: 50 }).default("pending"), // pending, verified, rejected
  
  // Notes
  notes: text("notes"),
  
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Insert schemas for subscription tables
export const insertSubscriptionPlanSchema = createInsertSchema(subscriptionPlans).omit({ id: true, createdAt: true, updatedAt: true });
export type InsertSubscriptionPlan = z.infer<typeof insertSubscriptionPlanSchema>;

export const insertSchoolSubscriptionSchema = createInsertSchema(schoolSubscriptions).omit({ id: true, createdAt: true, updatedAt: true });
export type InsertSchoolSubscription = z.infer<typeof insertSchoolSubscriptionSchema>;

export const insertSubscriptionInvoiceSchema = createInsertSchema(subscriptionInvoices).omit({ id: true, createdAt: true, updatedAt: true });
export type InsertSubscriptionInvoice = z.infer<typeof insertSubscriptionInvoiceSchema>;

export const insertSubscriptionLegalDocumentSchema = createInsertSchema(subscriptionLegalDocuments).omit({ id: true, createdAt: true, updatedAt: true });
export type InsertSubscriptionLegalDocument = z.infer<typeof insertSubscriptionLegalDocumentSchema>;

export const insertSchoolLegalAcceptanceSchema = createInsertSchema(schoolLegalAcceptances).omit({ id: true, createdAt: true });
export type InsertSchoolLegalAcceptance = z.infer<typeof insertSchoolLegalAcceptanceSchema>;

export const insertSubscriptionAuditLogSchema = createInsertSchema(subscriptionAuditLog).omit({ id: true, createdAt: true });
export type InsertSubscriptionAuditLog = z.infer<typeof insertSubscriptionAuditLogSchema>;

export const insertSubscriptionPaymentSchema = createInsertSchema(subscriptionPayments).omit({ id: true, createdAt: true, updatedAt: true });
export type InsertSubscriptionPayment = z.infer<typeof insertSubscriptionPaymentSchema>;

// Select types for subscription tables
export type SubscriptionPlan = typeof subscriptionPlans.$inferSelect;
export type SchoolSubscription = typeof schoolSubscriptions.$inferSelect;
export type SubscriptionInvoice = typeof subscriptionInvoices.$inferSelect;
export type SubscriptionLegalDocument = typeof subscriptionLegalDocuments.$inferSelect;
export type SchoolLegalAcceptance = typeof schoolLegalAcceptances.$inferSelect;
export type SubscriptionAuditLog = typeof subscriptionAuditLog.$inferSelect;
export type SubscriptionPayment = typeof subscriptionPayments.$inferSelect;

// Auth schemas for login
export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

export type LoginInput = z.infer<typeof loginSchema>;

// Dashboard stats type
export interface DashboardStats {
  totalSchools?: number;
  totalStudents?: number;
  totalTeachers?: number;
  totalClasses?: number;
  feeCollection?: string;
  myStudents?: number;
  myClasses?: number;
  pendingAssessments?: number;
  attendanceRate?: string;
}

// Module categories - 3 distinct sections
export const moduleCategories = ['admin', 'academic', 'premium'] as const;
export type ModuleCategory = typeof moduleCategories[number];

// Module definitions
export interface ModuleDefinition {
  id: string;
  name: string;
  description: string;
  icon: string;
  features: string[];
  status: string;
  isPremium: boolean;
  category: ModuleCategory;
  allowedRoles: UserRole[]; // Which roles can access this module
  hasConfigPage: boolean; // Does this module have a dedicated config page?
}
