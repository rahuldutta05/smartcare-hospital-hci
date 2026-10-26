# Design Principles
## Shneiderman's Eight Golden Rules
1. Consistency – same button styles, badges, dialogs everywhere.
2. Shortcuts – `/` focuses search; dashboard search skips the Patients screen; quick-action buttons for receptionists.
3. Informative feedback – toasts ("Appointment booked successfully."), live result counts.
4. Dialog closure – booking → toast; prescription saved → returns to profile.
5. Error prevention – booked slots disabled, Save disabled until a medication exists, confirm before cancel/share.
6. Easy reversal – Undo on booking, reschedule, cancel, queue call.
7. User control – role switcher, cancel in all dialogs, user-set accessibility.
8. Reduce memory load – allergies shown in profile header, dropdowns/datalist instead of typing, breadcrumbs.
## Norman's Seven Principles
Discoverability (labelled sidebar), feedback (toasts, aria-live), conceptual model (Dashboard → Patients → Profile → tabs), affordances/signifiers (filled buttons, icons with text, aria-pressed slots), mapping (queue number ↔ serving number ↔ patients ahead), constraints (disabled slots/buttons, validated fields).
## Cognitive load
Progressive disclosure (profile tabs), urgent-first sorting, 3 headline stats, grouped sections, meaningful defaults in prescription form.
## Information processing
The emergency banner is the only solid red full-width element, so it is noticed first; routine info uses neutral styling.
## Colour
Blue primary, green success, amber warning, red critical. Colour is never the only cue: every status has an icon and a word.

## Visual redesign rationale (v2)
- **Typeface – Atkinson Hyperlegible** (bundled locally, works offline): designed by the Braille Institute for character distinction; supports low-vision users and reduces misreading of similar glyphs (e.g. 0/O, 1/l) in IDs and doses.
- **Dark ink sidebar vs. light work area**: navigation recedes, clinical content stays high-contrast. Active item uses a left bar *and* tint (not colour alone).
- **Triage list instead of a table** (doctor dashboard): rows are ordered by clinical priority, with an urgency rail (solid red = emergency, dashed amber = waiting). Supports "who needs my attention?" in one glance (attention, Hick's law).
- **Single loudest element**: the emergency banner is the only saturated-red block; routine KPIs are plain numerals without boxes, so emergencies are not competing with decoration.
- **Global search in the top bar** with `/` shortcut: shortcut for experts, visible affordance for novices (Shneiderman rule 2).
- **Pre-visit brief** (simulated; inspired by the DocConnect symptom summary): reduces recall load before a consultation.
- **Patient home**: visit-progress journey (Checked in → Waiting → Your turn) turns an anxious "how long?" into a clear status.
- **Bed board**: critical = thick red double outline + ⚠, attention = dashed + ▲, vacant = dotted + ○ — status readable in greyscale.

## Clinical refinement (v3)
- **Palette and type:** deep clinical teal on white and cool grey, with Inter. Status colours are used only for badges, dots, borders and progress; each badge also carries a glyph and text, so meaning never depends on colour.
- **Fewer cards:** KPI cards are neutral with a small status dot. Schedule and patients are tables (avatar, ID, sortable headers with `aria-sort`, row selection, sticky header, pagination), not card grids.
- **Emergency:** a white panel with a red edge and heading. It is the only red block on the dashboard, so it is noticed without turning the page red.
- **Patient profile:** header with blood group and emergency contact, an allergy warning bar (amber), arrow-key tabs, a medical summary and lab status with progress.
- **Registration:** four-step stepper with grouped fieldsets, required markers, inline validation, Back, and a confirm-before-discard dialog.
- **Notification centre:** popover with categories, unread dots, timestamps, "Mark all as read", Esc to close.
- **Feedback states:** skeleton loading rows, empty states with an icon, toasts with undo.

## Consistency and workflow fixes (v4)
- **One data model** (`src/data/data.js`): each patient owns their bed, blood group, emergency contact, allergies and history. Beds, alerts, vitals, reports, schedule and queue are derived from it, so Arjun Kumar is ICU-04 on every screen. Doctors match departments and rooms (Sharma/Cardiology/204, Iyer/Neurology/108, Menon/Orthopedics/302, Rao/General Medicine/110). Demo clock: 25 Oct 2026, 10:20 AM.
- **Alert acknowledgement ≠ resolution** (visibility of status): acknowledging records who and when, but the emergency card and alert stay visible while the patient is critical.
- **Slot availability** depends on doctor + date + existing bookings; booked slots are disabled and labelled "Booked"; rescheduling offers only free slots; cancel and reschedule can be undone.
- **Queue** shows the ladder (A24 serving → A27 you) and derives "patients ahead" and wait time from one shared counter, so the patient dashboard, queue page and staff "Call next" always agree.
- **Empty states never claim something happened**: "No reports yet" rather than "All reports reviewed".
- **Demo role switch** moved to My profile; the top-right shows the signed-in user and duty status.
- **Three-level hierarchy**: white panels for primary work, tinted borderless blocks for supporting information, plain text for metadata.

## Refinement pass (v5)
- **Route protection:** `Gate` in `App.jsx` checks the first path segment against a per-role list and redirects anything else to `/dashboard` (demo only, not authentication). Prescribing is Doctor-only.
- **One availability rule:** `isBooked()` and the shared `SlotPicker` serve both Appointments and Registration. Doctors are filtered by department, booked slots are disabled, and the final confirm re-checks the slot. New registrations create a patient and a booking that appear in the schedule.
- **Single source of truth:** names, rooms, queue values and hospital figures come from `src/data/data.js` (`TODAY`, `NOW`, `H`, `QUEUE`). Demo dates use UTC so they never shift with the browser's timezone.
- **Status values:** one capitalization (`In Consultation`) and one `TONE` map without duplicate keys.
- **Accessibility:** `reduceMotion` defaults from the browser's `prefers-reduced-motion` setting.

## Institutional refinement (v7)
- **From cards to a workspace:** sections are open (divider and heading) rather than boxed. Only forms, supporting summaries and interactive objects carry a border or tint. Tables and worklists read as operational lists. Consistency means the same *behaviour and vocabulary*, not the same box.
- **Priority attention is a worklist:** severity label (⚠ CRITICAL, ▲ HIGH, ✔ NORMAL), patient and reason, wait or bed, one action. Severity is carried by text and symbol as well as colour.
- **Dashboard order follows clinical priority:** context, emergency, priority worklist, today's workflow, operational metrics, supporting actions.
- **Typeface:** Source Sans 3 replaces Inter; headings 600, controls 500, 700 only for critical values.
- **Radius system:** 6px controls, 4px navigation and badges, 8px panels and dialogs, circular avatars only.
- **Quieter chrome:** sidebar grouped by task; search leads the top bar, identity is second, theme and notifications are borderless utilities; decorative icons removed from KPIs, department lists and headings.
- **Button hierarchy:** View patient is primary, Acknowledge and Cancel are secondary, Download is a text action, destructive actions are red.
- **Token fix:** `--soft`, `--overlay` and `--shadow` previously referenced themselves in light mode; they now have real values in both themes.
