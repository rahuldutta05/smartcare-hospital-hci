# SmartCare Hospital Management System

## Overview

SmartCare is a role-based hospital management system built as a **Human-Computer Interaction (HCI) academic project**. The goal is not to demonstrate full-stack engineering. It is to demonstrate usability, accessibility, information hierarchy, consistency, error prevention and human-centered interaction design in a realistic hospital setting.

It is a **front-end prototype**. All data is fictional and held in memory (`src/data/data.js`). There is no backend, database, real authentication or integration with any hospital system.

## Key Features

- **Role-based dashboards** for Doctor, Nurse, Receptionist, Patient and Administrator, each showing the information that role needs first
- **Patient management**: searchable patients table with department, doctor and status filters, sortable columns, row selection and pagination
- **Patient profiles** with tabs: Overview, Appointments, Medical History (typed timeline), Prescriptions, Lab Reports, Billing (demo invoices)
- **Appointment scheduling** with reschedule, cancel (with confirmation) and undo
- **Appointment availability validation**: a slot is blocked only for the same doctor, date and time; booked slots are disabled and labelled
- **Patient registration**: four-step stepper with grouped fields, inline validation, doctor-by-department filtering and the same availability check as appointments
- **Queue management**: patient view (position, patients ahead, estimated wait) and staff view ("Call next")
- **Emergency alert** for a critical patient, with acknowledgement that records who and when but keeps the condition visibly critical
- **Alerts queue**, **Vitals table** (SpO₂ flags), **Medication schedule** ("Mark as administered" with undo)
- **Reports and laboratory information** table with search, status, department and date filters, progress for processing reports (View / Download are demo actions)
- **Prescription form** with medication suggestions, add / edit / remove, preview and save
- **Messaging**: two-pane internal conversations with unread indicators (messages last for the current session only)
- **Notifications**: header panel and full page, with mark-as-read
- **Staff**, **Resources** and **Analytics** pages for administrators (static demo figures)
- **Profile** and **Accessibility** pages
- **Accessibility settings**: text size, high contrast, reduced motion, light / dark / system theme
- **Role-based route protection** (demo only), **responsive layout** with bottom navigation on small screens

## User Roles

| Role | Main capabilities |
|---|---|
| Doctor | Patients, patient profiles, appointments, queue, reports, messages, notifications, vitals, alerts, prescriptions |
| Nurse | Ward overview, patients, vitals, medication, alerts, messages |
| Receptionist | Registration, appointments, queue, patient search |
| Patient | Own appointments, queue position, reports, prescriptions, messages, profile |
| Administrator | Staff, resources, analytics, patients, settings |

All roles can open **My profile** and **Accessibility**. Routes outside a role's list redirect to the dashboard.

## HCI Principles Demonstrated

| HCI Principle | SmartCare Implementation |
|---|---|
| Visibility of System Status | Queue position and wait, appointment status badges, skeleton loading rows, "Last updated" timestamps, system status indicator, report progress |
| Match with Real World | Hospital terms: ward, ICU, bed, vitals, prescription, laboratory report, queue |
| User Control and Freedom | Cancel, Back, Undo toasts, closable panels, Esc to close, visible navigation |
| Consistency and Standards | One badge, button, table and form pattern; one status vocabulary; one icon set |
| Error Prevention | Disabled booked slots, doctor limited to department, required fields, confirmation dialogs for destructive actions |
| Recognition Rather Than Recall | Labels on all fields, breadcrumbs with names, patient name and ID everywhere, status text next to colour |
| Flexibility and Efficiency | `/` jumps to search, filters, sorting, role-specific quick actions |
| Aesthetic and Minimalist Design | Calm clinical palette, few cards, content ordered by priority |
| Error Recovery | Inline messages that say how to fix a problem, Undo, Try another slot |
| Accessibility | Keyboard operation, visible focus, contrast-checked themes, reduced motion, text scaling |

## HCI Heuristics Used (Nielsen)

1. **Visibility of system status**: queue page shows who is serving, patients ahead and estimated wait; lists show "Last updated 10:20 AM" from the demo clock; tables show skeleton rows while loading.
2. **Match between system and real world**: ICU-04, Ward A, SpO₂, prescription and laboratory report are used as hospital staff use them.
3. **User control and freedom**: booking, rescheduling, cancelling, queue calls and medication administration can be undone from the toast; registration has Back and a confirm-before-discard dialog.
4. **Consistency and standards**: statuses (Critical, Attention, Waiting, Completed…) look and read the same on every screen; actions use the same button styles and labels.
5. **Error prevention**: unavailable slots cannot be selected; a doctor must belong to the chosen department; registration re-checks the slot before confirming; cancelling an appointment asks first.
6. **Recognition rather than recall**: patient identity (name, ID, bed) stays visible; breadcrumbs show names; the history is a dated timeline.
7. **Flexibility and efficiency of use**: global patient search with `/` shortcut, filters and sorting, one-click quick actions per role.
8. **Aesthetic and minimalist design**: the dashboard leads with what needs attention, then metrics, then the day's workflow.
9. **Help users recognize, diagnose and recover from errors**: messages such as "Phone number must contain 10 digits." and "That slot is no longer available. Choose another time."
10. **Help and documentation**: the Accessibility page lists keyboard shortcuts; helper text appears under form groups; this README and `docs/` explain the design decisions.

## Accessibility Features

- **Dark / light / system theme**, chosen in Accessibility or with the header toggle, saved in `localStorage`; an explicit choice overrides the system preference
- **Keyboard access**: all controls reachable by Tab, arrow keys switch profile tabs, Esc closes panels and dialogs, skip-to-content link
- **Visible focus indicator** in both themes
- **Contrast**: both themes were checked automatically; high-contrast mode is also available
- **Reduced motion**: respects `prefers-reduced-motion` by default and can be set manually
- **Text scaling**: 90% to 150%
- **Semantic structure**: landmarks, real tables with captions, labelled form fields, `aria-sort`, `aria-current`
- **Status not by colour alone**: every badge has an icon and text; critical beds and alerts use outline and symbol as well as colour

Text size, contrast, motion and theme preferences are stored on the device.

## UI/UX Design System

- **Color system**: clinical teal primary; green, amber and red reserved for positive, warning and critical meaning; defined as CSS variables in `src/styles/app.css` with a separate dark palette
- **Typography**: Source Sans 3 (bundled locally): 600 for headings, 500 for controls and navigation, 700 only for critical values
- **Spacing**: 8px-based scale
- **Buttons**: primary, outlined (`ghost`), danger, small and large; consistent labels
- **Surfaces**: three levels. The page itself is the workspace (sections separated by a divider, no card); supporting information uses a tinted block; controls, tables and dialogs carry borders. Forms keep one restrained border.
- **Status badges**: icon + text + tint, one shared component
- **Tables**: sticky header, hover state, sortable headers where useful, pagination, horizontal scroll on small screens
- **Forms**: labels above fields, required marker, grouped fieldsets, inline validation
- **Navigation**: role-aware sidebar grouped into Workspace, Clinical, Communication, Administration and Account, with a left-bar active indicator, breadcrumbs, bottom navigation on mobile
- **Modal/dialog behavior**: alert dialog with Cancel as default focus; destructive actions use the danger style
- **Feedback/toast system**: short confirmations at the bottom right, with Undo where possible

## Technical Stack

- React 18
- Vite 5
- React Router (HashRouter)
- Lucide React (icons)
- `@fontsource/source-sans-3` (font)
- CSS (custom properties) and JavaScript

## Project Structure

```
src/
  App.jsx            routes, login screen, role route gate
  main.jsx           entry point
  components/UI.jsx  shared Badge, Stat, Bar, Empty, Skeleton, Emergency, PageHead
  layouts/Layout.jsx sidebar, header, search, notifications, breadcrumbs
  pages/Pages.jsx    all role screens
  hooks/useApp.jsx   role, theme, accessibility, toasts, dialogs, shared state
  data/data.js       fictional demo data and the demo clock (TODAY, NOW)
  styles/app.css     design tokens, light and dark themes, components
  utils/validate.js  form validation helpers
docs/                HCI documentation (personas, scenarios, task analysis, KLM/GOMS, STN, usability testing, heuristics, accessibility)
```

## Installation

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
npm run preview   # optional: serve the production build
```

## Demo Roles

The login screen and **My profile → Demonstration controls** let you switch roles to demonstrate the five interfaces. This is a **prototype mechanism, not authentication**: there are no accounts or passwords, and the route protection only redirects to the dashboard.

## Design Philosophy

SmartCare is intentionally calm and clinical rather than decorative, because hospital software prioritizes clarity, speed, accuracy, accessibility, information hierarchy, error prevention and predictable interaction. Red is kept for real critical conditions, and visual weight follows clinical priority.

## Future Scope

Not implemented, but realistic next steps:

- real authentication and authorization
- backend integration and database persistence
- real-time hospital queue updates
- electronic medical record integration
- laboratory information system integration
- notification services
- audit logging
- advanced analytics
- interoperability with healthcare standards
- deployment and security hardening
