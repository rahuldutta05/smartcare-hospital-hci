// Single source of truth. Demo clock is 25 Oct 2026, 10:20 AM.
export const NOW = "10:20 AM";
export const TODAY = "2026-10-25";
export const GREETING = NOW.includes("AM") ? "Good morning" : "Good afternoon";
export const ME_PID = "P1001";
export const VITALS_AT = "10:12 AM";
export const doctors = ["Dr. Sharma", "Dr. Iyer", "Dr. Menon", "Dr. Rao"];
export const depts = ["Cardiology", "Neurology", "Orthopedics", "General Medicine"];
export const DOCDEPT = {
  "Dr. Sharma": "Cardiology",
  "Dr. Iyer": "Neurology",
  "Dr. Menon": "Orthopedics",
  "Dr. Rao": "General Medicine",
};
export const ROOM = {
  "Dr. Sharma": "Room 204",
  "Dr. Iyer": "Room 108",
  "Dr. Menon": "Room 302",
  "Dr. Rao": "Room 110",
};
export const slots = ["09:00", "09:30", "10:00", "10:30", "11:00", "11:30"];
export const ROLE = {
  Doctor: { name: "Dr. Sharma", sub: "Cardiology", email: "a.sharma@smartcare.example", phone: "9876520001" },
  Nurse: { name: "Nurse Priya", sub: "Ward A · ICU", email: "priya@smartcare.example", phone: "9876520002" },
  Receptionist: { name: "Front Desk", sub: "Reception", email: "frontdesk@smartcare.example", phone: "9876520003" },
  Patient: { name: "Rahul Kumar", sub: "Patient " + ME_PID, email: "rahul.k@example.com", phone: "9876500001" },
  Administrator: {
    name: "Hospital Admin",
    sub: "Administration",
    email: "admin@smartcare.example",
    phone: "9876520005",
  },
};
export const patients = [
  {
    id: "P1001",
    name: "Rahul Kumar",
    age: 46,
    phone: "9876500001",
    dept: "Cardiology",
    doctor: "Dr. Sharma",
    status: "Stable",
    last: "14 Oct 2026",
    bed: null,
    bg: "B+",
    ec: { n: "Sunita Kumar", rel: "Spouse", ph: "9876510001" },
    allergies: ["Penicillin"],
    conditions: ["Hypertension"],
    note: "Avoid NSAIDs (hypertension)",
    meds: ["Amlodipine 5 mg · once daily", "Paracetamol 500 mg · as needed"],
    vitals: { SpO2: "97 %", BP: "138/88 mmHg", HR: "78 bpm", Temp: "98.4 °F" },
    hist: [
      ["14 Oct 2026", "Cardiology consultation", "Dr. Sharma · BP review, lipid profile ordered"],
      ["02 Sep 2026", "Medication change", "Amlodipine increased to 5 mg"],
      ["11 Mar 2026", "Diagnosis", "Hypertension"],
    ],
  },
  {
    id: "P1002",
    name: "Ananya Rao",
    age: 31,
    phone: "9876500002",
    dept: "Neurology",
    doctor: "Dr. Iyer",
    status: "Attention",
    last: "18 Oct 2026",
    bed: null,
    bg: "O+",
    ec: { n: "Karthik Rao", rel: "Brother", ph: "9876510002" },
    allergies: ["None known"],
    conditions: ["Migraine"],
    note: "",
    meds: ["Sumatriptan 50 mg · as needed"],
    vitals: { SpO2: "96 %", BP: "118/76 mmHg", HR: "88 bpm", Temp: "99.1 °F" },
    hist: [
      ["18 Oct 2026", "Neurology consultation", "Dr. Iyer · MRI Brain ordered"],
      ["09 Jul 2026", "Diagnosis", "Migraine"],
    ],
  },
  {
    id: "P1003",
    name: "Arjun Kumar",
    age: 67,
    phone: "9876500003",
    dept: "Cardiology",
    doctor: "Dr. Sharma",
    status: "Critical",
    last: "21 Oct 2026",
    bed: "ICU-04",
    bg: "A−",
    ec: { n: "Leela Kumar", rel: "Daughter", ph: "9876510003" },
    allergies: ["Sulfa drugs"],
    conditions: ["Heart failure", "Diabetes"],
    note: "Oxygen support if SpO₂ < 90%",
    meds: ["Furosemide 40 mg · once daily", "Metformin 500 mg · twice daily"],
    vitals: { SpO2: "82 %", BP: "96/60 mmHg", HR: "112 bpm", Temp: "98.9 °F" },
    hist: [
      ["21 Oct 2026", "Cardiology consultation", "Dr. Sharma · Chest pain follow-up"],
      ["21 Oct 2026", "Lab investigation", "ECG completed"],
      ["12 Aug 2026", "Diagnosis", "Heart failure"],
      ["04 Jun 2026", "General consultation", "Dr. Rao"],
    ],
  },
  {
    id: "P1004",
    name: "Meera Nair",
    age: 54,
    phone: "9876500004",
    dept: "Orthopedics",
    doctor: "Dr. Menon",
    status: "Stable",
    last: "02 Oct 2026",
    bed: "A02",
    bg: "AB+",
    ec: { n: "Rohan Nair", rel: "Son", ph: "9876510004" },
    allergies: ["None known"],
    conditions: ["Knee osteoarthritis"],
    note: "",
    meds: ["Paracetamol 500 mg · as needed"],
    vitals: { SpO2: "98 %", BP: "126/82 mmHg", HR: "72 bpm", Temp: "98.2 °F" },
    hist: [
      ["02 Oct 2026", "Orthopedic consultation", "Dr. Menon · Admitted for pre-operative care"],
      ["15 May 2026", "Diagnosis", "Knee osteoarthritis"],
    ],
  },
  {
    id: "P1005",
    name: "Vikram Singh",
    age: 39,
    phone: "9876500005",
    dept: "General Medicine",
    doctor: "Dr. Rao",
    status: "Under Observation",
    last: "25 Oct 2026",
    bed: "A01",
    bg: "O−",
    ec: { n: "Pooja Singh", rel: "Spouse", ph: "9876510005" },
    allergies: ["Dust"],
    conditions: ["Asthma"],
    note: "",
    meds: ["Salbutamol inhaler · as needed"],
    vitals: { SpO2: "94 %", BP: "120/80 mmHg", HR: "84 bpm", Temp: "98.6 °F" },
    hist: [
      ["25 Oct 2026", "General consultation", "Dr. Rao · Asthma check, kept under observation"],
      ["11 Oct 2026", "Emergency visit", "Wheeze and shortness of breath"],
    ],
  },
];
export const appointments = [
  {
    id: 1,
    pid: "P1003",
    date: TODAY,
    time: "09:00",
    reason: "Chest pain follow-up",
    status: "Emergency",
    doctor: "Dr. Sharma",
    dept: "Cardiology",
  },
  {
    id: 2,
    pid: "P1001",
    date: TODAY,
    time: "10:30",
    reason: "BP review",
    status: "Waiting",
    doctor: "Dr. Sharma",
    dept: "Cardiology",
  },
  {
    id: 3,
    pid: "P1002",
    date: TODAY,
    time: "10:00",
    reason: "Headache assessment",
    status: "Waiting",
    doctor: "Dr. Iyer",
    dept: "Neurology",
  },
  {
    id: 4,
    pid: "P1004",
    date: TODAY,
    time: "11:00",
    reason: "Knee pain review",
    status: "Confirmed",
    doctor: "Dr. Menon",
    dept: "Orthopedics",
  },
  {
    id: 5,
    pid: "P1005",
    date: TODAY,
    time: "09:30",
    reason: "Asthma check",
    status: "Completed",
    doctor: "Dr. Rao",
    dept: "General Medicine",
  },
];
export const ST = { 1: "In Consultation", 2: "Waiting", 3: "Delayed", 4: "Upcoming", 5: "Completed" };
export const WAIT = { 2: 5, 3: 20 };
export const BEDS = [
  ["A01", "P1005"],
  ["A02", "P1004"],
  ["A03", null],
  ["A04", null],
  ["ICU-03", null],
  ["ICU-04", "P1003"],
];
export const ALERTS = [
  { id: "AL1", pid: "P1003", sev: "Critical", text: "SpO₂ 82% ↓", first: "09:02 AM", last: VITALS_AT },
  { id: "AL2", pid: "P1005", sev: "Attention", text: "SpO₂ 94%, wheeze reported", first: "08:40 AM", last: "10:05 AM" },
];
export const MEDS = [
  { id: 1, pid: "P1003", med: "Furosemide", dose: "40 mg", time: "09:00", st: "Due" },
  { id: 2, pid: "P1003", med: "Metformin", dose: "500 mg", time: "08:00", st: "Administered" },
  { id: 3, pid: "P1005", med: "Salbutamol inhaler", dose: "2 puffs", time: "10:00", st: "Missed" },
  { id: 4, pid: "P1004", med: "Paracetamol", dose: "500 mg", time: "11:00", st: "Scheduled" },
  { id: 5, pid: "P1005", med: "Prednisolone", dose: "20 mg", time: "12:00", st: "Scheduled" },
];
export const meds = ["Amlodipine", "Atenolol", "Metformin", "Paracetamol", "Salbutamol", "Aspirin", "Furosemide"];
export const BRIEF = {
  1: {
    urgency: "High",
    complaint: "Chest tightness and breathlessness since last night",
    qs: [
      "Does the pain spread to the arm or jaw?",
      "Any missed doses of heart medication?",
      "How has SpO₂ trended since yesterday?",
    ],
  },
  2: {
    urgency: "Low",
    complaint: "Review of blood pressure readings",
    qs: ["Home BP log available?", "Any new medicines since the last visit?", "Salt and exercise habits?"],
  },
  3: {
    urgency: "Medium",
    complaint: "Recurring headache for 3 days, mild dizziness",
    qs: [
      "Any visual changes or nausea?",
      "Sleep and hydration this week?",
      "Response to the last migraine medication?",
    ],
  },
  4: {
    urgency: "Low",
    complaint: "Knee pain when climbing stairs",
    qs: ["Swelling or locking of the joint?", "Pain at rest (0–10)?", "Physiotherapy tried so far?"],
  },
};
export const staff = [
  {
    n: "Dr. Sharma",
    role: "Doctor",
    d: "Cardiology",
    room: "Room 204",
    shift: "08:00–16:00",
    st: "On duty",
    sp: "Cardiologist",
    now: "Available",
  },
  {
    n: "Dr. Iyer",
    role: "Doctor",
    d: "Neurology",
    room: "Room 108",
    shift: "08:00–16:00",
    st: "On duty",
    sp: "Neurologist",
    now: "In Consultation",
  },
  {
    n: "Dr. Menon",
    role: "Doctor",
    d: "Orthopedics",
    room: "Room 302",
    shift: "10:00–18:00",
    st: "On duty",
    sp: "Orthopedic surgeon",
    now: "Available",
  },
  {
    n: "Dr. Rao",
    role: "Doctor",
    d: "General Medicine",
    room: "Room 110",
    shift: "08:00–16:00",
    st: "On duty",
    sp: "Physician",
    now: "Available",
  },
  { n: "Nurse Priya", role: "Nurse", d: "Ward A · ICU", room: "ICU-04", shift: "07:00–15:00", st: "On duty" },
  { n: "Nurse Kavita", role: "Nurse", d: "Ward A", room: "A01–A04", shift: "07:00–15:00", st: "On break" },
  { n: "Nurse Dev", role: "Nurse", d: "ICU", room: "ICU-03", shift: "15:00–23:00", st: "Off shift" },
];
export const duty = staff
  .filter((s) => s.role === "Doctor")
  .map((s) => ({ n: s.n, sp: s.sp, d: s.d, room: s.room, st: s.now }));
export const deptInfo = [
  ["Cardiology", 12, "8 appointments"],
  ["Neurology", 7, "5 appointments"],
  ["Emergency", 4, "12 active cases"],
  ["Pediatrics", 9, "15 appointments"],
];
export const activity = [
  ["10:12", "Nurse Priya recorded vitals for P1003"],
  ["10:05", "Dr. Iyer updated patient P1002"],
  ["09:58", "Lab report uploaded for P1001"],
  ["09:40", "Appointment confirmed for P1004"],
];
export const notes = [
  { id: 1, cat: "Emergency alert", text: "Arjun Kumar (ICU-04): SpO₂ 82%.", time: "09:02", unread: true },
  { id: 2, cat: "Lab report available", text: "CBC for Rahul Kumar is ready.", time: "09:42", unread: true },
  {
    id: 3,
    cat: "Appointment reminder",
    text: "Rahul Kumar is booked for 10:30 with Dr. Sharma.",
    time: "08:00",
    unread: true,
  },
  { id: 4, cat: "Doctor schedule change", text: "Dr. Menon starts at 10:00 today.", time: "Yesterday", unread: false },
  { id: 5, cat: "System notification", text: "Scheduled maintenance Sunday 02:00.", time: "Yesterday", unread: false },
];
export const labs = [
  {
    id: "R1",
    pid: "P1001",
    name: "CBC",
    dept: "Cardiology",
    date: "2026-10-25",
    when: "Completed 25 Oct · 09:42 AM",
    st: "Completed",
    pr: 100,
  },
  {
    id: "R2",
    pid: "P1001",
    name: "Blood Test",
    dept: "Cardiology",
    date: "2026-10-25",
    when: "Resulted 25 Oct · 09:58 AM",
    st: "Ready for review",
    pr: 100,
  },
  {
    id: "R3",
    pid: "P1002",
    name: "MRI Brain",
    dept: "Neurology",
    date: "2026-10-25",
    when: "Expected by 2:30 PM",
    st: "Processing",
    pr: 55,
  },
  {
    id: "R4",
    pid: "P1003",
    name: "ECG",
    dept: "Cardiology",
    date: "2026-10-21",
    when: "Completed 21 Oct · 08:30 AM",
    st: "Completed",
    pr: 100,
  },
  {
    id: "R5",
    pid: "P1001",
    name: "Lipid Profile",
    dept: "Cardiology",
    date: "2026-10-14",
    when: "Completed 14 Oct · 11:10 AM",
    st: "Completed",
    pr: 100,
  },
];
export const bills = [
  ["INV-2041", "Consultation", "₹800", "Paid"],
  ["INV-2058", "Lab tests", "₹1,200", "Pending"],
];
export const convos = [
  {
    id: "nurse",
    name: "Nurse Priya",
    sub: "Nurse · Ward A",
    pat: false,
    unread: true,
    msgs: [["them", "Arjun Kumar’s SpO₂ dropped to 82% (ICU-04). Please review.", "09:02"]],
  },
  {
    id: "reception",
    name: "Front Desk",
    sub: "Reception",
    pat: true,
    unread: true,
    msgs: [["them", "Rahul Kumar checked in for his 10:30 appointment.", "10:15"]],
  },
  {
    id: "doctor",
    name: "Dr. Sharma",
    sub: "Cardiology",
    pat: true,
    unread: false,
    msgs: [["them", "Your blood test result is ready to view.", "09:58"]],
  },
];
export const QUEUE = { mine: 27 };

// Hospital-wide demo figures (single place to change)
export const H = {
  patientsTotal: 1248,
  patientsWeek: 18,
  apptsToday: 86,
  apptsDone: 9,
  bedsFree: 24,
  bedsTotal: 80,
  bedsSoon: 6,
  emergencyCases: 3,
  avgWait: 18,
  waitDelta: 2,
  emergencyBedsFree: 4,
  emergencyBedsTotal: 10,
  icuFree: 2,
  icuTotal: 12,
  vitalsRecorded: VITALS_AT,
  occupancy: [
    ["General Ward", 80],
    ["ICU", 92],
    ["Emergency", 90],
  ],
};
Object.assign(QUEUE, { start: 24, perPatient: 5, doctor: "Dr. Sharma", updated: NOW });
// One availability rule, used by Appointments and Registration
export const isBooked = (list, doctor, date, time, skipId) =>
  list.some(
    (a) => a.id !== skipId && a.doctor === doctor && a.date === date && a.time === time && a.status !== "Cancelled",
  );
export const fmtTime = (t) => {
  const [h, m] = t.split(":");
  return (h % 12 || 12) + ":" + m + (h < 12 ? " AM" : " PM");
};
export const addPatient = ({ name, dob, phone, bg, ec, allergies, cond, meds, enotes, dept, doctor }) => {
  const age = Math.max(0, new Date(TODAY).getUTCFullYear() - new Date(dob).getUTCFullYear());
  const p = {
    id: "P" + (1001 + patients.length),
    name,
    age,
    phone,
    dept,
    doctor,
    status: "Stable",
    last: "New patient",
    bed: null,
    bg: bg || "Unknown",
    ec: { n: ec, rel: "Emergency contact", ph: "" },
    allergies: [allergies || "None known"],
    conditions: cond ? [cond] : [],
    note: enotes || "",
    meds: meds ? [meds] : [],
    vitals: { SpO2: "—", BP: "—", HR: "—", Temp: "—" },
    hist: [["25 Oct 2026", "Registration", "Registered at front desk"]],
  };
  patients.push(p);
  return p;
};

export const SYSTEM = { state: "ok", label: "All services operational" };
