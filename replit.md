# SmartGenEduX - Multi-Tenancy School ERP System

## Overview
SmartGenEduX is a comprehensive multi-tenancy school management ERP system designed to streamline administrative, academic, and financial operations for educational institutions. It features three module sections (Admin, Academic, Premium) with role-based access for 7 user roles. The system includes advanced features like AI-powered analytics (Vipu.ai), a Super Admin exclusive coding assistant (VipuDev.ai), robust alert systems, and integrated payment solutions. Key capabilities include AI-powered substitution management, automatic CBSE grade calculation, intelligent invigilation duty allocation, and anti-bullying prevention with automated risk assessment. The business vision is to provide a cutting-edge ERP solution that enhances efficiency and provides intelligent insights for educational institutions, tapping into a significant market potential for integrated school management systems.

## User Preferences
Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework Stack:** React 18+ with TypeScript, Vite, Wouter for routing, and TanStack Query for server state management.
- **UI Component System:** shadcn/ui with Radix UI primitives and Tailwind CSS, utilizing a custom "New York" style variant.
- **Design System:** Dark-mode-first, professional education technology aesthetic, custom color palette, responsive design.
- **State Management:** React Query for API data, local storage for authentication and user preferences.

### Backend Architecture
- **Server Framework:** Express.js with TypeScript, using custom middleware for logging and error handling.
- **Authentication & Authorization:** JWT for session management and role-based access control (RBAC) across 7 user roles. Tokens are stored in localStorage.
- **API Design:** RESTful API with structured error responses and CORS support.

### Data Storage
- **Database:** PostgreSQL (Neon Database) as the primary database, utilizing Drizzle ORM for type-safe queries and migrations.
- **Schema Design:** UUID primary keys, timestamp tracking, foreign key relationships, and user roles defined as PostgreSQL text types with TypeScript enums.

### System Design Choices
- **Multi-Tenancy:** Implemented across critical modules like payment gateway, WhatsApp API, ID card design, attendance, transportation, library rules, and AI configurations (Vipu.ai).
- **Role-Based Access Control (RBAC):** Granular control for Super Admin, Principal, School Admin (wing-based), AC Incharge, Librarian, Teachers, Parents, and Students.
- **AI Integration:**
    - **VipuDev.ai:** Super Admin exclusive coding assistant (OpenAI GPT-4o).
    - **Vipu.ai:** School analytics AI for Principal & Super Admin (OpenAI GPT-4o), provides real-time insights and downloadable reports with multi-tenancy config.
    - **Timesubbehave.ai (Premium):** Behavior management AI assistant.
- **Academic Modules:** Timetable Management (wing-based, conflict detection), AI-powered Substitution Manager, Automatic CBSE Grade Calculation, Intelligent Invigilation Duty Allocation, Student Distribution System, Anti-bullying Prevention via Student Behavioral Tracker, and CBSE Document Tracking.
- **Comprehensive Modules:**
    - **Admin:** Arattai Smart Alert, Fee Management (payment gateway integration), WhatsApp Smart Alert, Attendance Management (GPS tracking, barcode scanning), Transportation Management (GPS tracking, live bus map).
    - **Academic:** ID Card Generator, Library Management, School Event Log (AI summarizer), Document Automation / Watermark Templates.
    - **Premium:** Timesubbehave.ai, Fee with Tally.
- **Barcode Integration:** For attendance, library, and transportation.
- **School Settings & Audit Logs:** Comprehensive settings management with audit logging and JSON backup/import.
- **Comprehensive Dashboard:** Dynamic filters, drill-down capabilities, and multi-module statistics.

## External Dependencies

### Third-Party Services
- **OpenAI API:** For VipuDev.ai and Vipu.ai assistants (GPT-4o).
- **Supabase:** For specific backend functionalities.
- **Payment Gateways:** Stripe, Razorpay, PayU, PayPal (configurable per school).
- **WhatsApp Business API:** For WhatsApp Smart Alert module.
- **Neon Database:** Serverless PostgreSQL.
- **Gemini AI:** For AI-powered event summary generation.

### Key NPM Packages
- **Database:** `drizzle-orm`, `@neondatabase/serverless`, `pg`.
- **Authentication:** `jsonwebtoken`, `bcrypt`.
- **UI Components:** `@radix-ui/*`, `shadcn/ui`.
- **Build Tools:** `vite`, `esbuild`, `tsx`.
- **Utilities:** `nanoid`, `wouter`, `cmdk`.