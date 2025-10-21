# SmartGenEduX Design Guidelines

## Design Approach
**Reference-Based + Custom System**: Drawing inspiration from modern SaaS dashboards (Linear, Notion) while maintaining a unique educational technology identity. The platform uses a sophisticated dark theme with vibrant accent colors to convey professionalism and cutting-edge technology.

## Core Design Principles
1. **Professional Education Technology**: Balance between enterprise reliability and modern design
2. **Role-Based Clarity**: Clear visual hierarchy for different user roles (Super Admin, School Admin, Teacher, Parent, Student)
3. **Module-Centric Navigation**: Each of 19+ modules has distinct visual identity
4. **Data Density with Breathing Room**: Information-rich but never cluttered

---

## Color Palette

### Dark Mode (Primary)
- **Background Deep**: `#181c24` (sidebar, footer)
- **Background Main**: `#232837` (main content area)
- **Surface**: `#2d3247` (cards, tiles)
- **Surface Hover**: `#3a4060` (interactive states)

### Brand Colors
- **Primary Purple**: `270 75% 60%` (gradient start #7c4dff)
- **Deep Purple**: `282 69% 35%` (gradient end #6a1b9a)
- **Primary Blue**: `231 48% 48%` (#3949ab)
- **Deep Blue**: `231 55% 23%` (#1a237e)

### Accent Colors
- **Success/Accent**: `167 100% 45%` (#00e6b8) - primary actions, active states
- **Premium Badge**: `45 100% 50%` (#ffb300) - premium features
- **AI Features**: `199 100% 50%` (#00b0ff) - AI-powered modules
- **Warning**: `14 85% 60%` - alerts
- **Error**: `0 72% 51%` - errors, destructive actions

### Text Colors
- **Primary Text**: `#f5f6fa` (high contrast)
- **Secondary Text**: `#8a8fa3` (muted, labels)
- **Tertiary Text**: `#8e99f3` (micro text, hints)

---

## Typography

### Font Families
- **Primary**: 'Segoe UI', Arial, sans-serif (system fonts for performance)
- **Fallback**: System UI stack for optimal rendering

### Type Scale
- **Hero Heading (H1)**: 2rem (32px), font-weight: 700
- **Section Heading (H2)**: 1.4-1.5rem (22-24px), font-weight: 700
- **Module Title**: 1.2rem (19px), font-weight: 600
- **Body**: 1rem (16px), font-weight: 400
- **Small**: 0.98rem (15.7px)
- **Micro**: 0.85-0.87rem (13.6-14px)

### Usage Guidelines
- Login headings use gradient text: `bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent`
- Module names are center-aligned, white text
- Statistics use large bold numbers with smaller muted labels below

---

## Layout System

### Spacing Units (Tailwind)
Primary spacing rhythm uses: `p-4, p-6, p-8, m-4, m-6, m-8` (16px, 24px, 32px intervals)
- Card padding: `32px 24px` (large) or `48px 36px` (hero cards)
- Grid gaps: `32px` (desktop), `18px` (mobile)
- Section spacing: `py-12` to `py-20`

### Grid Patterns
- **Dashboard Modules**: `grid-template-columns: repeat(auto-fit, minmax(260px, 1fr))`
- **Stats Cards**: Flexible grid, 2-4 columns depending on role
- **Sidebar**: Fixed `260px` width

### Container Widths
- **Dashboard Content**: `max-w-7xl` with responsive padding
- **Login Cards**: `max-w-400px` centered
- **Full-width sections**: `w-full` with inner constraint

---

## Component Library

### Authentication Pages (Login/Register)
- **Glassmorphism Cards**: `background: rgba(30, 32, 60, 0.68)`, `backdrop-filter: blur(18px)`, border `1.5px solid rgba(255,255,255,0.13)`
- **Blur Shapes**: Absolute positioned circles with `filter: blur(60px)` in purple/blue gradients
- **Circuit Pattern Background**: SVG overlay with low opacity geometric shapes
- **Border Radius**: `32px` for cards, `16px` for inputs
- **Input Fields**: Floating labels, icon prefixes (👤, 🔒), smooth transitions on focus
- **Primary Button**: `linear-gradient(90deg, #7c4dff 0%, #3949ab 100%)`, hover scale `1.03`

### Dashboard Components
- **Sidebar Navigation**: Fixed left, dark background, circular logo container with accent border
- **Top Header**: Glass effect bar, platform logo, user role badge, quick stats panel
- **Module Tiles**: 
  - Background: `var(--tile-bg)`
  - Border radius: `18px`
  - Hover: `translateY(-8px) scale(1.03)` with shadow increase
  - Logo: 56px circular, white background, accent border
  - Premium badge: Absolute top-right, yellow/blue depending on type
  - Features: Bulleted list, muted text
  - Action button: Gradient on hover states

### Statistics Cards
- Icon + Large number + Small label vertical stack
- Icons: Emoji or SVG (🏫, 👥, 📊, 💰)
- Numbers: Bold, large font
- Labels: Muted color, smaller font

### Badges & Tags
- **Premium**: `background: #ffb300`, rounded `12px`, padding `6px 14px`
- **AI**: `background: #00b0ff`
- **Status**: Color-coded (active: green, pending: yellow, inactive: gray)
- **Role Tags**: Accent background, rounded `16px`, medium font-weight

### Navigation Icons
- Size: `48px × 48px`
- Background: Tile color, rounded `12px`
- Hover: Accent color with background transition
- Active state: Accent color maintained

---

## Visual Effects & Animations

### Glassmorphism
Applied to: Login cards, dashboard header, overlays
```
background: rgba(15, 23, 42, 0.85)
backdrop-filter: blur(12px)
border: 1px solid rgba(59, 130, 246, 0.2)
box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3)
```

### Background Patterns
- **Circuit Board**: Overlaid SVG pattern with opacity `0.3`, geometric grid lines
- **Blur Blobs**: Animated gradient circles, `filter: blur(60px)`, subtle pulse animation
- **Gradient Overlay**: `radial-gradient` and `linear-gradient` combinations for depth

### Hover States
- **Module Cards**: Transform `translateY(-8px)`, scale `1.03`, shadow increase
- **Buttons**: Scale `1.03`, shadow bloom
- **Input Focus**: Border color change to primary purple, subtle glow

### Loading States
- **Spinner**: Dual rotating borders (blue + purple), opposite directions
- **Progress Bar**: Gradient shimmer effect
- **Skeleton**: Pulse animation on glassmorphic containers

### Transitions
- Default: `0.2s ease` for colors and borders
- Transform: `0.18s cubic-bezier(0.4, 0, 0.2, 1)`
- Fade in: `0.6s cubic-bezier` with translateY

---

## Module-Specific Guidelines

### 19+ Module Icons
- **Format**: SVG files in `Module Assets & Logos/` directory
- **Size**: 40-56px displayed, scalable
- **Background**: White circular container, accent border
- **Consistent Style**: Flat design, 2-color maximum, recognizable silhouettes

### Company Logo (SmartGenEduX)
- **Placement**: 
  - Sidebar top (80px × 80px, circular white background)
  - Header left (48px × 48px, rounded `12px`)
  - Login page center (64px × 64px, circular with shadow)
  - Footer bottom-right (32px × 32px, low opacity watermark)
- **Always Visible**: Logo present on every page

### Role-Based Dashboards
- **Super Admin**: System-wide stats (schools, revenue, uptime)
- **School Admin**: School-specific stats (students, teachers, classes, fees)
- **Teacher**: Personal stats (students, classes, assessments, attendance)
Different color emphases for different roles (super admin sees more purple/premium, teachers see more blue/functional)

---

## Accessibility & Dark Mode

### Contrast Ratios
- Primary text on dark: WCAG AAA compliant
- Accent colors tested for visibility on dark backgrounds
- Interactive elements have minimum `3:1` contrast

### Focus States
- Purple glow for keyboard navigation
- Visible outline on all interactive elements
- Skip links for screen readers

### Dark Mode (Only)
Platform is dark-mode exclusive for:
- Reduced eye strain during extended sessions
- Professional, modern appearance
- Better focus on colorful data visualizations

---

## Responsive Breakpoints

### Desktop (>900px)
- Full sidebar visible
- Multi-column module grid (3-4 columns)
- Horizontal header with full quick stats

### Tablet (600-900px)
- Sidebar hidden (hamburger menu)
- 2-column module grid
- Condensed header

### Mobile (<600px)
- Single column layout
- Simplified cards with reduced padding
- Bottom navigation consideration
- Blur blobs hidden for performance

---

## Images & Iconography

### Module Icons
- Custom SVG icons for all 19+ modules
- Located in designated assets folder
- Consistent style: minimalist, 2-tone
- Examples: Attendance (checkmark), Fee (rupee), Arattai (WhatsApp), VIPU (brain/AI)

### No Hero Images
Login and dashboard use gradient backgrounds with geometric patterns instead of photography to maintain professional SaaS aesthetic.

### Placeholder States
- Empty states use muted illustrations or simple icons
- Loading states show skeleton screens with glassmorphic effect

---

## Interactive States

### Button States
- **Default**: Gradient background, shadow
- **Hover**: Scale `1.03`, shadow bloom
- **Active**: Slight scale down `0.98`
- **Disabled**: Opacity `0.6`, cursor not-allowed
- **Loading**: Spinner icon, text hidden

### Input States
- **Default**: Transparent background, subtle border
- **Focus**: Purple border, floating label animation
- **Error**: Red border, error message below
- **Success**: Green border (form submission)

### Module Card States
- **Default**: Flat with shadow
- **Hover**: Elevated, scaled, background color shift
- **Active/Selected**: Accent border glow

---

## Content Strategy

### Dashboard
- Immediate value: Stats grid prominently displayed
- Organized by type: Academic modules vs. Premium modules sections
- Quick actions: Launch button on every module card
- Contextual info: Role-specific greetings and data

### Module Cards
- Icon at top for instant recognition
- Title (module name) below icon
- 3 key features as bullets
- Status badge (Active/Premium/AI)
- Launch button for action

### Forms & Inputs
- Clear labels with icons
- Inline validation
- Helpful placeholder text
- Error messages appear below field

---

## Performance Considerations

- Use system fonts for instant loading
- SVG icons over icon fonts
- Minimal animations on mobile
- Lazy load module content
- CSS-only effects where possible (no JS animations for glassmorphism)

---

## Brand Consistency

### SmartGenEduX Identity
- **Voice**: Professional, innovative, educational
- **Visual Style**: Modern SaaS meets education technology
- **Color Association**: Purple = innovation/premium, Blue = trust/stability, Teal = success/growth
- **Logo Omnipresence**: Every screen reinforces brand identity

This design system creates a cohesive, professional platform that balances data density with visual appeal, making complex school management feel approachable and modern.