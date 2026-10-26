import { NavLink, Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { Avatar, Empty } from "../components/UI.jsx";
import { Sun, Moon, User as UserIcon, Settings as SettingsIcon } from "lucide-react";
import { SYSTEM } from "../data/data.js";
import { patients, ROLE } from "../data/data.js";
import { useApp } from "../hooks/useApp.jsx";
import {
  Home,
  Users,
  Calendar,
  Hash,
  FileText,
  MessageSquare,
  Activity,
  Pill,
  Bell,
  UserPlus,
  BarChart3,
  Settings,
  Boxes,
  User,
  Stethoscope,
  Search,
  CalendarClock,
  FlaskConical,
  ShieldAlert,
  Info,
} from "lucide-react";
export const NAV = {
  Doctor: [
    ["Dashboard", "/dashboard", Home],
    ["Patients", "/patients", Users],
    ["Appointments", "/appointments", Calendar],
    ["Queue", "/queue", Hash],
    ["Reports", "/reports", FileText],
    ["Messages", "/messages", MessageSquare],
    ["Notifications", "/notifications", Bell],
  ],
  Nurse: [
    ["Dashboard", "/dashboard", Home],
    ["Patients", "/patients", Users],
    ["Vitals", "/vitals", Activity],
    ["Medication", "/medication", Pill],
    ["Alerts", "/alerts", Bell],
    ["Messages", "/messages", MessageSquare],
  ],
  Receptionist: [
    ["Dashboard", "/dashboard", Home],
    ["Patients", "/patients", Users],
    ["Appointments", "/appointments", Calendar],
    ["Registration", "/registration", UserPlus],
    ["Queue", "/queue", Hash],
  ],
  Patient: [
    ["Home", "/dashboard", Home],
    ["Appointments", "/appointments", Calendar],
    ["Queue", "/queue", Hash],
    ["Reports", "/reports", FileText],
    ["Prescriptions", "/prescriptions", Pill],
    ["Messages", "/messages", MessageSquare],
    ["Profile", "/profile", User],
  ],
  Administrator: [
    ["Dashboard", "/dashboard", Home],
    ["Patients", "/patients", Users],
    ["Staff", "/staff", Stethoscope],
    ["Resources", "/resources", Boxes],
    ["Analytics", "/analytics", BarChart3],
    ["Settings", "/settings", Settings],
  ],
};
const GROUPS = [
  ["Workspace", ["/dashboard", "/patients", "/appointments", "/queue", "/registration"]],
  ["Clinical", ["/vitals", "/medication", "/alerts", "/reports", "/prescriptions"]],
  ["Communication", ["/messages", "/notifications"]],
  ["Administration", ["/staff", "/resources", "/analytics"]],
  ["Account", ["/profile", "/settings"]],
];
const CI = {
  "Appointment reminder": CalendarClock,
  "Lab report available": FlaskConical,
  "Doctor schedule change": Users,
  "Emergency alert": ShieldAlert,
  "System notification": Info,
};
export default function Layout() {
  const { role, ns, setNs, theme, setTheme, acks } = useApp();
  const dark = theme === "dark" || (theme === "system" && matchMedia("(prefers-color-scheme: dark)").matches);
  const loc = useLocation();
  const nav = useNavigate();
  const main = useRef();
  const q = useRef();
  const bell = useRef();
  const [open, setOpen] = useState(false);
  const unread = ns.filter((n) => n.unread).length;
  useEffect(() => {
    main.current?.focus();
    setOpen(false);
  }, [loc.pathname]);
  useEffect(() => {
    const k = (e) => {
      if (e.key === "/" && !["INPUT", "SELECT", "TEXTAREA"].includes(document.activeElement.tagName)) {
        e.preventDefault();
        q.current?.focus();
      }
      if (e.key === "Escape") setOpen(false);
    };
    const c = (e) => {
      if (!bell.current?.contains(e.target)) setOpen(false);
    };
    window.addEventListener("keydown", k);
    document.addEventListener("mousedown", c);
    return () => {
      window.removeEventListener("keydown", k);
      document.removeEventListener("mousedown", c);
    };
  }, []);
  const LB = { prescribe: "New prescription", settings: "Accessibility", profile: "My profile" };
  const name = (c) => patients.find((p) => p.id === c)?.name || LB[c] || c[0].toUpperCase() + c.slice(1);
  const crumbs = loc.pathname
    .split("/")
    .filter(Boolean)
    .filter((c) => c !== "dashboard");
  const staff = role !== "Patient";
  return (
    <div className="shell">
      <a
        className="skip"
        href="#main"
        onClick={(e) => {
          e.preventDefault();
          main.current.focus();
        }}
      >
        Skip to content
      </a>
      <aside>
        <div className="brand">
          <Stethoscope aria-hidden="true" />
          <span>
            SmartCare<small>Main Campus</small>
          </span>
        </div>
        <nav aria-label="Main">
          {GROUPS.map(([label, paths]) => {
            const items = NAV[role].filter(([, p]) => paths.includes(p));
            if (!items.length) return null;
            return (
              <div className="nav-group" key={label}>
                <div className="nav-label">{label}</div>
                {items.map(([l, p, I]) => (
                  <NavLink key={p + l} to={p} className="nl">
                    <I size={18} aria-hidden="true" />
                    <span>{l}</span>
                    {p === "/notifications" && ns.some((n) => n.unread) && (
                      <span className="navdot" aria-label={ns.filter((n) => n.unread).length + " unread"}>
                        {ns.filter((n) => n.unread).length}
                      </span>
                    )}
                    {p === "/alerts" && !acks.AL1 && (
                      <span className="navdot" aria-label="Unacknowledged critical alert">
                        1
                      </span>
                    )}
                  </NavLink>
                ))}
              </div>
            );
          })}
        </nav>
        <div className="side-foot">
          <NavLink to="/profile" className="nl">
            <UserIcon size={18} aria-hidden="true" />
            <span>My profile</span>
          </NavLink>
          <NavLink to="/settings" className="nl">
            <SettingsIcon size={18} aria-hidden="true" />
            <span>Accessibility</span>
          </NavLink>
        </div>
      </aside>
      <div className="col">
        <header className="topbar">
          {staff ? (
            <form
              role="search"
              className="search"
              onSubmit={(e) => {
                e.preventDefault();
                nav("/patients?q=" + encodeURIComponent(q.current.value));
              }}
            >
              <Search size={18} aria-hidden="true" />
              <input
                ref={q}
                aria-label="Search patients by name, ID or phone"
                placeholder="Search patients, appointments, doctors…"
              />
              <kbd aria-hidden="true">/</kbd>
              <button className="btn sm">Search</button>
            </form>
          ) : (
            <strong>SmartCare Patient Portal</strong>
          )}
          <span className="sp" />
          <span className={"sysstat " + (SYSTEM.state === "ok" ? "" : SYSTEM.state)} role="status">
            <i aria-hidden="true" />
            System status: {SYSTEM.label}
          </span>
          <button
            className="iconbtn quiet"
            data-tip={dark ? "Switch to light mode" : "Switch to dark mode"}
            aria-label={dark ? "Switch to light mode" : "Switch to dark mode"}
            onClick={() => setTheme(dark ? "light" : "dark")}
          >
            {dark ? <Sun size={18} aria-hidden="true" /> : <Moon size={18} aria-hidden="true" />}
          </button>
          <div className="pop-wrap" ref={bell}>
            <button
              className="iconbtn quiet"
              data-tip="Notifications"
              aria-label={"Notifications, " + unread + " unread"}
              aria-expanded={open}
              aria-haspopup="true"
              onClick={() => setOpen(!open)}
            >
              <Bell size={18} aria-hidden="true" />
              {unread > 0 && <span className="dot" aria-hidden="true" />}
            </button>
            {open && (
              <div className="pop" role="dialog" aria-label="Notifications">
                <div className="pop-h">
                  <b>Notifications</b>
                  <button
                    className="link"
                    disabled={!unread}
                    onClick={() => setNs(ns.map((n) => ({ ...n, unread: false })))}
                  >
                    Mark all as read
                  </button>
                </div>
                {ns.length ? (
                  <ul>
                    {ns.map((n) => {
                      const I = CI[n.cat];
                      return (
                        <li key={n.id} className={n.unread ? "unread" : ""}>
                          <I size={18} aria-hidden="true" />
                          <div>
                            <small>{n.cat}</small>
                            <p>{n.text}</p>
                            <time>{n.time}</time>
                          </div>
                          {n.unread && <span className="udot" role="img" aria-label="Unread" />}
                        </li>
                      );
                    })}
                  </ul>
                ) : (
                  <Empty t="You are all caught up." />
                )}
                <Link to="/notifications">View all notifications</Link>
              </div>
            )}
          </div>

          <Link className="me" to="/profile" aria-label="Your profile and demo role">
            <Avatar name={ROLE[role].name} />
            <span>
              <b>{ROLE[role].name}</b>
              <small>
                {ROLE[role].sub}
                {staff && (
                  <>
                    {" "}
                    · <span className="duty-on">● On duty</span>
                  </>
                )}
              </small>
            </span>
          </Link>
        </header>
        <main id="main" tabIndex="-1" ref={main}>
          <nav aria-label="Breadcrumb" className="crumbs">
            <Link to="/dashboard">Dashboard</Link>
            {crumbs.map((c, i) => (
              <span key={i}>
                {" "}
                /{" "}
                {i === crumbs.length - 1 ? (
                  <b aria-current="page">{name(c)}</b>
                ) : (
                  <Link to={"/" + crumbs.slice(0, i + 1).join("/")}>{name(c)}</Link>
                )}
              </span>
            ))}
          </nav>
          <Outlet />
        </main>
      </div>
    </div>
  );
}
