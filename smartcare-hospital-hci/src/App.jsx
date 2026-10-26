import { Routes, Route, Navigate, useNavigate, useLocation } from "react-router-dom";
import { Stethoscope, UserRound, Users, Hash, ShieldCheck } from "lucide-react";
import { useApp } from "./hooks/useApp.jsx";
import Layout from "./layouts/Layout.jsx";
import * as P from "./pages/Pages.jsx";
function Login() {
  const { pick } = useApp();
  const nav = useNavigate();
  const R = [
    ["Doctor", "Review patients and consultations", Stethoscope],
    ["Nurse", "Monitor wards and vitals", Users],
    ["Receptionist", "Register, book and manage queue", Hash],
    ["Patient", "See appointments and queue", UserRound],
    ["Administrator", "Hospital overview", ShieldCheck],
  ];
  return (
    <div className="login">
      <section className="login-l">
        <h1>
          <Stethoscope size={40} aria-hidden="true" />
          SmartCare
        </h1>
        <p>Smart Hospital Management System</p>
        <p>Less searching, fewer errors, and clear answers for everyone in the building.</p>
      </section>
      <main className="login-r">
        <h2 style={{ fontSize: "1.6rem" }}>Who is using SmartCare?</h2>
        <p className="mut">Choose a role. Each one opens a screen built for that person’s tasks.</p>
        <div className="roles">
          {R.map(([r, d, I]) => (
            <button
              key={r}
              className="role"
              onClick={() => {
                pick(r);
                nav("/dashboard");
              }}
            >
              <I aria-hidden="true" />
              <b>{r}</b>
              <span>{d}</span>
            </button>
          ))}
        </div>
        <p className="note">Demo only – no real login. All data is fictional.</p>
      </main>
    </div>
  );
}
// Lightweight role gate: unknown routes for a role fall back to the dashboard (demo only, not authentication).
const COMMON = ["dashboard", "profile", "settings"];
const ACCESS = {
  Doctor: [...COMMON, "patients", "appointments", "queue", "reports", "messages", "notifications", "vitals", "alerts"],
  Nurse: [...COMMON, "patients", "vitals", "medication", "alerts", "messages"],
  Receptionist: [...COMMON, "patients", "appointments", "registration", "queue"],
  Patient: [...COMMON, "appointments", "queue", "reports", "prescriptions", "messages"],
  Administrator: [...COMMON, "patients", "staff", "resources", "analytics"],
};
function Gate() {
  const { role } = useApp();
  const [section, , sub] = useLocation().pathname.split("/").filter(Boolean);
  const allowed = ACCESS[role]?.includes(section) && !(sub === "prescribe" && role !== "Doctor");
  return allowed ? <Layout /> : <Navigate to="/dashboard" replace />;
}
export default function App() {
  const { role } = useApp();
  return (
    <Routes>
      <Route path="/" element={role ? <Navigate to="/dashboard" /> : <Login />} />
      {role ? (
        <Route element={<Gate />}>
          <Route path="/dashboard" element={<P.Dashboard />} />
          <Route path="/patients" element={<P.Patients />} />
          <Route path="/patients/:id" element={<P.Profile />} />
          <Route path="/patients/:id/prescribe" element={<P.Prescribe />} />
          <Route path="/appointments" element={<P.Appointments />} />
          <Route path="/queue" element={<P.Queue />} />
          <Route path="/vitals" element={<P.Vitals />} />
          <Route path="/medication" element={<P.Medication />} />
          <Route path="/alerts" element={<P.Alerts />} />
          <Route path="/messages" element={<P.Messages />} />
          <Route path="/notifications" element={<P.Notifications />} />
          <Route path="/registration" element={<P.Registration />} />
          <Route path="/reports" element={<P.Reports />} />
          <Route path="/prescriptions" element={<P.Prescriptions />} />
          <Route path="/staff" element={<P.Staff />} />
          <Route path="/resources" element={<P.Resources />} />
          <Route path="/analytics" element={<P.Analytics />} />
          <Route path="/settings" element={<P.Settings />} />
          <Route path="/profile" element={<P.Account />} />
        </Route>
      ) : null}
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}
