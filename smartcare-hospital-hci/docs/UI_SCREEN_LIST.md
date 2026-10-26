# UI Screen List
Login/role select · Doctor dashboard · Reception dashboard · Patient home (mobile-friendly) · Nurse ward dashboard (+Vitals/Medication/Alerts views) · Admin dashboard (+Staff/Resources/Analytics views) · Patient search · Patient profile (5 tabs) · Prescription · Appointments · Smart queue (staff + patient) · Emergency alert component · Registration · Messages/Notifications · Reports/Prescriptions · Accessibility settings/Profile.

## Routes by role (v4: every route is a distinct screen)
| Role | Routes |
|---|---|
| Doctor | dashboard, patients, patients/:id, patients/:id/prescribe, appointments, queue, reports, messages, notifications, alerts |
| Nurse | dashboard (ward and ICU board), vitals, medication, alerts, messages, patients |
| Receptionist | dashboard, patients, appointments, registration (4-step), queue |
| Patient | dashboard, appointments, queue, reports, prescriptions, messages, profile |
| Administrator | dashboard (overview), staff, resources, analytics, patients, settings |
| All | profile (account + demo role switch), settings (accessibility) |
