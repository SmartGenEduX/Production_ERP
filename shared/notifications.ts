import { z } from "zod";

// Notification channels
export const notificationChannels = ['whatsapp', 'arattai', 'email', 'sms', 'in_app'] as const;
export type NotificationChannel = typeof notificationChannels[number];

// Notification event types - triggers from various modules
export const notificationEvents = [
  // Attendance events
  'student_absent',
  'student_late',
  'teacher_absent',
  'low_attendance_alert',
  
  // Fee events
  'fee_due_reminder',
  'fee_payment_received',
  'fee_overdue',
  'payment_confirmation',
  
  // Academic events
  'exam_schedule_update',
  'result_published',
  'assignment_posted',
  'homework_reminder',
  
  // Admission events
  'application_received',
  'admission_approved',
  'document_pending',
  
  // Transportation events
  'bus_arrival_alert',
  'route_change',
  'transport_delay',
  
  // School events
  'event_reminder',
  'holiday_announcement',
  'parent_meeting',
  'emergency_alert',
  
  // Library events
  'book_due_reminder',
  'book_overdue',
  'fine_reminder',
  
  // Substitution events
  'teacher_substitution',
  'leave_approved',
  'timetable_change',
  
  // CBSE events
  'registration_update',
  'document_required',
  
  // General
  'birthday_wish',
  'achievement_notification',
  'complaint_update',
] as const;
export type NotificationEvent = typeof notificationEvents[number];

// Recipient types
export const recipientTypes = ['parent', 'teacher', 'student', 'staff', 'all'] as const;
export type RecipientType = typeof recipientTypes[number];

// Notification template interface
export interface NotificationTemplate {
  id: string;
  event: NotificationEvent;
  channels: NotificationChannel[]; // WhatsApp, Arattai, Email, SMS
  recipients: RecipientType[];
  whatsappTemplate?: string;
  arattaiTemplate?: string;
  emailTemplate?: string;
  smsTemplate?: string;
  isActive: boolean;
  priority: 'low' | 'medium' | 'high' | 'urgent';
}

// WhatsApp message types
export interface WhatsAppMessage {
  to: string; // Phone number
  template: string;
  variables: Record<string, string>;
  mediaUrl?: string; // For images, documents
  scheduledAt?: Date;
}

// Arattai alert types
export interface ArattaiAlert {
  recipients: string[]; // Phone numbers or email addresses
  message: string;
  alertType: 'info' | 'warning' | 'urgent' | 'success';
  voiceCall?: boolean; // Automated voice call
  smsBackup?: boolean; // SMS backup if WhatsApp fails
  scheduledAt?: Date;
}

// Notification integration schema
export const notificationConfigSchema = z.object({
  moduleId: z.string(),
  eventType: z.enum(notificationEvents),
  channels: z.array(z.enum(notificationChannels)),
  recipients: z.array(z.enum(recipientTypes)),
  autoSend: z.boolean().default(false),
  requireApproval: z.boolean().default(false),
  templates: z.object({
    whatsapp: z.string().optional(),
    arattai: z.string().optional(),
    email: z.string().optional(),
    sms: z.string().optional(),
  }),
  isActive: z.boolean().default(true),
});

export type NotificationConfig = z.infer<typeof notificationConfigSchema>;

// Integration triggers - what events trigger notifications
export const MODULE_NOTIFICATION_TRIGGERS = {
  // Attendance Management
  attendance: [
    'student_absent',
    'student_late',
    'teacher_absent',
    'low_attendance_alert',
  ],
  
  // Fee Management
  'fee-management': [
    'fee_due_reminder',
    'fee_payment_received',
    'fee_overdue',
    'payment_confirmation',
  ],
  
  // Admission Management
  admission: [
    'application_received',
    'admission_approved',
    'document_pending',
  ],
  
  // Transportation
  transportation: [
    'bus_arrival_alert',
    'route_change',
    'transport_delay',
  ],
  
  // School Events
  'school-events': [
    'event_reminder',
    'holiday_announcement',
    'parent_meeting',
    'emergency_alert',
  ],
  
  // Library
  library: [
    'book_due_reminder',
    'book_overdue',
    'fine_reminder',
  ],
  
  // Timetable
  timetable: [
    'timetable_change',
    'exam_schedule_update',
  ],
  
  // Substitution
  substitution: [
    'teacher_substitution',
    'leave_approved',
  ],
  
  // Report Tracker
  reports: [
    'result_published',
    'assignment_posted',
  ],
  
  // CBSE Registration
  'cbse-registration': [
    'registration_update',
    'document_required',
  ],
} as const;

// Default notification templates
export const DEFAULT_WHATSAPP_TEMPLATES = {
  student_absent: "🚨 Attendance Alert\nDear {parent_name},\n\nYour child {student_name} ({class}) was marked ABSENT on {date}.\n\nIf this is unexpected, please contact the school.\n\n- {school_name}",
  
  fee_due_reminder: "💰 Fee Reminder\nDear {parent_name},\n\nFee payment of ₹{amount} is due on {due_date} for {student_name} ({class}).\n\nPlease make payment at your earliest convenience.\n\n- {school_name}",
  
  fee_payment_received: "✅ Payment Confirmation\nDear {parent_name},\n\nWe have received your fee payment of ₹{amount} for {student_name}.\n\nReceipt No: {receipt_no}\nDate: {payment_date}\n\nThank you!\n- {school_name}",
  
  exam_schedule_update: "📚 Exam Alert\nDear {parent_name},\n\n{exam_name} for {student_name} ({class}) has been scheduled:\n\nDate: {exam_date}\nSubject: {subject}\n\nPlease ensure your child is well prepared.\n- {school_name}",
  
  bus_arrival_alert: "🚌 Bus Tracking\nDear {parent_name},\n\nSchool bus #{bus_number} will arrive at {stop_name} in approximately {eta} minutes.\n\nRoute: {route_name}\n- {school_name}",
  
  parent_meeting: "👨‍👩‍👧 Meeting Notice\nDear {parent_name},\n\nParent-Teacher meeting scheduled on {meeting_date} at {meeting_time}.\n\nVenue: {venue}\nAgenda: {agenda}\n\nYour presence is important.\n- {school_name}",
  
  emergency_alert: "🚨 URGENT ALERT\nDear {parent_name},\n\n{emergency_message}\n\nPlease contact the school immediately or check the school portal for updates.\n\nContact: {school_contact}\n- {school_name}",
} as const;

export const DEFAULT_ARATTAI_TEMPLATES = {
  student_absent: "Alert: {student_name} absent on {date}. Class {class}. Contact school if unexpected.",
  
  fee_overdue: "Urgent: Fee payment of Rs.{amount} overdue for {student_name}. Please pay immediately to avoid penalty.",
  
  result_published: "Results published for {student_name} ({class}). Login to portal to view detailed report card.",
  
  transport_delay: "Bus #{bus_number} delayed by {delay_minutes} minutes due to {reason}. Updated ETA: {new_eta}",
  
  emergency_alert: "EMERGENCY: {emergency_message}. Contact school: {school_contact}. Follow instructions immediately.",
} as const;
