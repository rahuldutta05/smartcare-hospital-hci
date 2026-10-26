import { useState, useRef, useEffect } from "react";
import { Link, useNavigate, useParams, useSearchParams } from "react-router-dom";
import {
  Search,
  Plus,
  Trash2,
  Lock,
  PhoneCall,
  FileText,
  Pill,
  MessageSquare,
  Hash,
  UserPlus,
  Calendar,
  Upload,
  AlertTriangle,
  FolderOpen,
  Eye,
  ArrowUp,
  ArrowDown,
  ChevronsUpDown,
  Users,
  BedDouble,
  Clock,
  FlaskConical,
  Stethoscope,
  Heart,
  Brain,
  Bone,
  Siren,
  Baby,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Download,
  Check,
  Undo2,
  Keyboard,
  Wrench,
  Send,
  Activity,
  BarChart3,
} from "lucide-react";
import { useApp } from "../hooks/useApp.jsx";
import {
  patients,
  appointments as A0,
  doctors,
  depts,
  slots,
  meds,
  BRIEF,
  ROOM,
  ST,
  WAIT,
  BEDS,
  ALERTS,
  MEDS,
  duty,
  staff,
  deptInfo,
  activity,
  labs,
  bills,
  convos,
  notes as N0,
  ROLE,
  DOCDEPT,
  NOW,
  QUEUE,
  H,
  ME_PID,
  GREETING,
  TODAY,
  isBooked,
  fmtTime,
  addPatient,
} from "../data/data.js";
import { Badge, Stat, Bar, Empty, Emergency, Avatar, PageHead, Skel } from "../components/UI.jsx";
import { valid10 } from "../utils/validate.js";
const pt = (id) => patients.find((p) => p.id === id);
function SearchBox({ defaultValue = "" }) {
  const nav = useNavigate();
  const r = useRef();
  return (
    <form
      role="search"
      className="search"
      onSubmit={(e) => {
        e.preventDefault();
        nav("/patients?q=" + encodeURIComponent(r.current.value));
      }}
    >
      <Search aria-hidden="true" />
      <input
        ref={r}
        defaultValue={defaultValue}
        aria-label="Search patients by name, ID or phone"
        placeholder="Search name, ID or phone"
      />
      <button className="btn">Search</button>
    </form>
  );
}
const Who = ({ p }) => (
  <span className="pn">
    <Avatar name={p.name} />
    <span>
      <b>{p.name}</b>
      <small>{p.id}</small>
    </span>
  </span>
);
const useLoad = (ms = 600) => {
  const [l, setL] = useState(true);
  useEffect(() => {
    const t = setTimeout(() => setL(false), ms);
    return () => clearTimeout(t);
  }, []);
  return l;
};
const fd = (d) => new Date(d).toLocaleDateString("en-GB", { day: "2-digit", month: "short", timeZone: "UTC" });
const DATE = new Date(TODAY);
const dateLine = () =>
  DATE.toLocaleDateString("en-GB", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  }) +
  " · Main Campus · Last updated " +
  NOW;
const DI = { Cardiology: Heart, Neurology: Brain, Emergency: Siren, Pediatrics: Baby };
const stOf = (a) => ST[a.id] || (a.status === "Confirmed" ? "Upcoming" : a.status);
const DOCS = staff.filter((x) => x.role === "Doctor");
const DOCS_ON = DOCS.filter((x) => x.st === "On duty").length;
const NURSES_ON = staff.filter((x) => x.role === "Nurse" && x.st === "On duty").length;
const AVAILABLE_DOCS = duty.filter((d) => d.st === "Available").length;
const evType = (t) =>
  /diagnosis/i.test(t)
    ? "Diagnosis"
    : /medication/i.test(t)
      ? "Medication change"
      : /lab|investigation/i.test(t)
        ? "Investigation"
        : /registration/i.test(t)
          ? "Registration"
          : "Consultation";
function SlotPicker({ list, doctor, date, value, onPick, error }) {
  return (
    <fieldset style={{ marginTop: 16 }}>
      <legend>
        Available times · {fd(date)} · {doctor} · {ROOM[doctor]}
      </legend>
      <div className="slots">
        {slots.map((t) => {
          const booked = isBooked(list, doctor, date, t);
          return (
            <button
              key={t}
              type="button"
              disabled={booked}
              aria-pressed={value === t}
              className={"btn ghost slot " + (value === t ? "on" : "")}
              onClick={() => onPick(t)}
            >
              {t}
              {booked && " · Booked"}
            </button>
          );
        })}
      </div>
      {error && (
        <span className="err" role="alert">
          {error}
        </span>
      )}
    </fieldset>
  );
}
function ApptTable({ list }) {
  return (
    <div className="scroll">
      <table>
        <caption className="sr">Appointments</caption>
        <thead>
          <tr>
            <th>Time</th>
            <th>Patient</th>
            <th>Reason</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {list.map((a) => (
            <tr key={a.id}>
              <td>{a.time}</td>
              <td>
                <Who p={pt(a.pid)} />
              </td>
              <td>{a.reason}</td>
              <td>
                <Badge s={a.status} />
              </td>
              <td>
                <Link className="btn sm" to={"/patients/" + a.pid}>
                  Open record
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
const hello = () => {
  const h = new Date().getHours();
  return h < 12 ? "Good morning" : h < 17 ? "Good afternoon" : "Good evening";
};
function Quick({ role }) {
  const L = {
    Doctor: [
      ["View patients", "/patients"],
      ["Review reports", "/reports"],
      ["Check queue", "/queue"],
    ],
    Nurse: [
      ["Record vitals", "/vitals"],
      ["Review medications", "/medication"],
      ["View alerts", "/alerts"],
    ],
    Receptionist: [
      ["Register patient", "/registration"],
      ["Book appointment", "/appointments"],
      ["View queue", "/queue"],
    ],
    Patient: [
      ["Book appointment", "/appointments"],
      ["View reports", "/reports"],
      ["View prescriptions", "/prescriptions"],
    ],
    Administrator: [
      ["Manage staff", "/staff"],
      ["View resources", "/resources"],
      ["Analytics", "/analytics"],
    ],
  }[role];
  return (
    <section className="quick" aria-label="Quick actions">
      <h2 className="mini">Quick actions</h2>
      <div className="row">
        {L.map(([label, to]) => (
          <Link key={label} className="btn ghost sm" to={to}>
            {label}
          </Link>
        ))}
      </div>
    </section>
  );
}
function Schedule({ list }) {
  const [f, setF] = useState("All");
  const rows = list.filter((a) => f === "All" || stOf(a) === f);
  return (
    <section className="panel flush">
      <div className="ph">
        <h2>Today’s schedule</h2>
        <div className="chips" role="group" aria-label="Filter schedule by status">
          {["All", "Upcoming", "In Consultation", "Delayed", "Completed"].map((x) => (
            <button key={x} className="chip" aria-pressed={f === x} onClick={() => setF(x)}>
              {x}
            </button>
          ))}
        </div>
      </div>
      {rows.length ? (
        <div className="scroll">
          <table>
            <thead>
              <tr>
                <th>Time</th>
                <th>Patient</th>
                <th>Doctor</th>
                <th>Department</th>
                <th>Room</th>
                <th>Status</th>
                <th>
                  <span className="sr">Actions</span>
                </th>
              </tr>
            </thead>
            <tbody>
              {rows.map((a) => (
                <tr key={a.id}>
                  <td className="num">{a.time}</td>
                  <td>
                    <Who p={pt(a.pid)} />
                  </td>
                  <td>{a.doctor}</td>
                  <td>{a.dept}</td>
                  <td>{ROOM[a.doctor]}</td>
                  <td>
                    <Badge s={stOf(a)} />
                  </td>
                  <td>
                    <Link
                      className="iconbtn sm"
                      data-tip="Open patient record"
                      aria-label={"Open record for " + pt(a.pid).name}
                      to={"/patients/" + a.pid}
                    >
                      <FolderOpen size={16} aria-hidden="true" />
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <Empty t="No appointments in this state." icon={Calendar} />
      )}
    </section>
  );
}
const Feed = () => (
  <section className="panel soft">
    <h2>Recent activity</h2>
    <ul className="feed">
      {activity.map(([t, x]) => (
        <li key={t}>
          <time>{t}</time>
          <span>{x}</span>
        </li>
      ))}
    </ul>
  </section>
);
const Duty = () => (
  <section className="panel soft">
    <h2>Doctors on duty</h2>
    <ul className="duty">
      {duty.map((d) => (
        <li key={d.n}>
          <Avatar name={d.n} />
          <span>
            <b>{d.n}</b>
            <small>
              {d.sp} · {d.d}
            </small>
          </span>
          <span className={"avail " + (d.st === "Available" ? "ok" : "info")}>
            ● {d.st}
            <small>{d.room}</small>
          </span>
        </li>
      ))}
    </ul>
  </section>
);
const Depts = () => (
  <section className="panel soft">
    <h2>Department overview</h2>
    <ul className="depts">
      {deptInfo.map(([n, d, a]) => {
        const I = DI[n];
        return (
          <li key={n}>
            <span>
              <b>{n}</b>
              <small>
                {d} doctors · {a}
              </small>
            </span>
          </li>
        );
      })}
    </ul>
  </section>
);
function PQ({ list }) {
  const rows = list
    .filter((a) => a.status === "Emergency" || a.status === "Waiting")
    .sort((a, b) => (b.status === "Emergency") - (a.status === "Emergency") || (WAIT[b.id] || 0) - (WAIT[a.id] || 0));
  const severity = (a) =>
    a.status === "Emergency"
      ? ["CRITICAL", "crit", "⚠"]
      : WAIT[a.id] >= 15
        ? ["HIGH", "warn", "▲"]
        : ["NORMAL", "ok", "✔"];
  return (
    <section className="panel" aria-labelledby="pq-h">
      <h2 id="pq-h">Priority attention</h2>
      {rows.length ? (
        <ol className="worklist">
          {rows.map((a) => {
            const [label, tone, glyph] = severity(a);
            const patient = pt(a.pid);
            return (
              <li key={a.id} className={tone === "crit" ? "crit" : ""}>
                <span className={"wl-sev " + tone}>
                  <span aria-hidden="true">{glyph} </span>
                  {label}
                </span>
                <span>
                  <b>{patient.name}</b>
                  <small>{a.reason}</small>
                </span>
                <span className="wl-meta">{WAIT[a.id] ? WAIT[a.id] + " min wait" : patient.bed}</span>
                <Link className={"btn sm " + (tone === "crit" ? "" : "ghost")} to={"/patients/" + a.pid}>
                  View patient<span className="sr"> {patient.name}</span>
                </Link>
              </li>
            );
          })}
        </ol>
      ) : (
        <Empty t="No patients currently waiting" />
      )}
    </section>
  );
}
export function Dashboard() {
  const { role, toast, acks, ack, qcur, appts } = useApp();
  const A0 = appts.filter((a) => a.date === TODAY);
  const crit = patients.find((p) => p.status === "Critical");
  const rank = { Emergency: 0, Waiting: 1, Confirmed: 2, Completed: 3, Cancelled: 4 };
  const sorted = [...A0].sort((a, b) => rank[a.status] - rank[b.status] || a.time.localeCompare(b.time));
  const n = (s) => A0.filter((a) => stOf(a) === s).length;
  const next = sorted.find((a) => !["Completed", "Cancelled"].includes(a.status));
  const B = next && (BRIEF[next.id] || BRIEF[4]);
  const up = [...A0].filter((a) => stOf(a) !== "Completed").sort((a, b) => a.time.localeCompare(b.time));
  if (role === "Patient") {
    const mine = appts.find(
      (a) => a.pid === ME_PID && a.date === TODAY && !["Cancelled", "Completed"].includes(a.status),
    ) || { doctor: QUEUE.doctor, dept: DOCDEPT[QUEUE.doctor], time: "10:30" };
    const ahead = Math.max(QUEUE.mine - qcur, 0);
    return (
      <>
        <PageHead title={GREETING + ", " + ROLE.Patient.name.split(" ")[0]} sub={dateLine()} />
        <section className="hero-p" aria-label="Upcoming appointment">
          <p className="lbl">Upcoming appointment</p>
          <p className="xl">
            {mine.doctor} · {mine.dept}
          </p>
          <p>
            {fmtTime(mine.time)} · {ROOM[mine.doctor]}
          </p>
          <p style={{ marginTop: 12 }}>
            {ahead > 0 ? (
              <>
                <b>{ahead} patients ahead of you.</b> Estimated wait: {ahead * QUEUE.perPatient} minutes.
              </>
            ) : (
              <b>It is your turn. Please go to {ROOM[mine.doctor]}.</b>
            )}
          </p>
          <div className="row">
            <Link className="btn lg" to="/appointments">
              View appointment
            </Link>
            <Link className="btn ghost lg" to="/queue">
              Check queue
            </Link>
          </div>
        </section>
        <Quick role="Patient" />
        <h2 className="mini">Your records and contact</h2>
        <ul className="links">
          <li>
            <Link to="/reports">
              <FileText size={18} aria-hidden="true" />
              Reports<small>1 ready to view</small>
            </Link>
          </li>
          <li>
            <Link to="/prescriptions">
              <Pill size={18} aria-hidden="true" />
              Prescriptions<small>2 current</small>
            </Link>
          </li>
          <li>
            <Link to="/messages">
              <MessageSquare size={18} aria-hidden="true" />
              Messages<small>Contact Dr. Sharma or the front desk</small>
            </Link>
          </li>
        </ul>
        <section className="panel soft">
          <h2>Notifications</h2>
          <p>✔ Your blood test result is ready to view.</p>
          <p>
            Reminder: appointment today at {fmtTime(mine.time)}, {ROOM[mine.doctor]}.
          </p>
        </section>
      </>
    );
  }
  if (role === "Administrator") return <Admin />;
  if (role === "Nurse") return <Wards />;
  const doc = role === "Doctor";
  return (
    <>
      <PageHead title={doc ? GREETING + ", " + ROLE.Doctor.name : "Reception desk"} sub={dateLine()}>
        {doc ? (
          <Link className="btn" to="/patients">
            <Search size={16} aria-hidden="true" />
            Find patient
          </Link>
        ) : (
          <Link className="btn" to="/registration">
            <Plus size={16} aria-hidden="true" />
            Register patient
          </Link>
        )}
      </PageHead>
      {doc && crit && (
        <Emergency
          p={crit}
          ack={acks.AL1}
          onAck={() => {
            ack("AL1");
            toast("Alert acknowledged. The condition is still critical.");
          }}
        />
      )}
      <PQ list={A0} />
      <div className="split">
        <Schedule list={sorted} />
        <div>
          <section className="panel soft">
            <h2>Up next</h2>
            {up.length ? (
              <ol className="tl">
                {up.map((a) => (
                  <li key={a.id}>
                    <time>{a.time}</time>
                    <div>
                      <b>{a.reason}</b>
                      <small>
                        {a.doctor} · {ROOM[a.doctor]}
                      </small>
                    </div>
                  </li>
                ))}
              </ol>
            ) : (
              <Empty t="No appointments scheduled" icon={Calendar} />
            )}
          </section>
        </div>
      </div>
      <div className="kpis">
        <Stat icon={Calendar} n={A0.length} l="Today’s appointments" ctx={n("Completed") + " completed"} />
        <Stat
          icon={Clock}
          n={A0.filter((a) => a.status === "Waiting").length}
          l="Patients waiting"
          tone="warn"
          ctx={"Longest wait " + Math.max(...Object.values(WAIT)) + " min"}
        />
        {doc ? (
          <Stat
            icon={AlertTriangle}
            n={patients.filter((p) => p.status === "Critical").length}
            l="Emergency cases"
            tone="crit"
            ctx={patients
              .filter((p) => p.status === "Critical")
              .map((p) => p.bed)
              .join(", ")}
          />
        ) : (
          <Stat
            icon={BedDouble}
            n={H.bedsFree + " / " + H.bedsTotal}
            l="Available beds"
            ctx={H.bedsSoon + " becoming available today"}
          />
        )}
        {doc ? (
          <Stat
            icon={FlaskConical}
            n={labs.filter((l) => l.st !== "Completed").length}
            l="Pending reports"
            ctx={labs.filter((l) => l.st === "Ready for review").length + " ready for review"}
          />
        ) : (
          <Stat
            icon={Stethoscope}
            n={DOCS_ON + " / " + DOCS.length}
            l="Doctors on duty"
            ctx={AVAILABLE_DOCS + " available now"}
          />
        )}
      </div>

      <Quick role={role} />
      {!doc && (
        <div className="grid2">
          <Duty />
          <Depts />
        </div>
      )}
    </>
  );
}
export function Patients() {
  const [sp] = useSearchParams();
  const q = (sp.get("q") || "").toLowerCase();
  const { role, toast } = useApp();
  const load = useLoad();
  const [f, setF] = useState({ dept: "", doctor: "", status: "" });
  const [sort, setSort] = useState({ k: "name", d: 1 });
  const [pg, setPg] = useState(0);
  const [sel, setSel] = useState([]);
  const PS = 4;
  const val = (p, k) => (k === "last" ? new Date(p.last) : p[k]);
  const r = patients
    .filter(
      (p) =>
        (!q || [p.name, p.id, p.phone].some((x) => x.toLowerCase().includes(q))) &&
        (!f.dept || p.dept === f.dept) &&
        (!f.doctor || p.doctor === f.doctor) &&
        (!f.status || p.status === f.status),
    )
    .sort((a, b) => (val(a, sort.k) > val(b, sort.k) ? 1 : -1) * sort.d);
  const pages = Math.max(1, Math.ceil(r.length / PS));
  const cur = Math.min(pg, pages - 1);
  const rows = r.slice(cur * PS, cur * PS + PS);
  const S = (k, l, o) => (
    <label>
      {l}
      <select
        value={f[k]}
        onChange={(e) => {
          setF({ ...f, [k]: e.target.value });
          setPg(0);
        }}
      >
        <option value="">All</option>
        {o.map((x) => (
          <option key={x}>{x}</option>
        ))}
      </select>
    </label>
  );
  const TH = (k, l) => (
    <th aria-sort={sort.k === k ? (sort.d > 0 ? "ascending" : "descending") : "none"}>
      <button className="th" onClick={() => setSort({ k, d: sort.k === k ? -sort.d : 1 })}>
        {l}
        {sort.k === k ? (
          sort.d > 0 ? (
            <ArrowUp size={14} aria-hidden="true" />
          ) : (
            <ArrowDown size={14} aria-hidden="true" />
          )
        ) : (
          <ChevronsUpDown size={14} aria-hidden="true" />
        )}
      </button>
    </th>
  );
  const all = rows.length > 0 && rows.every((p) => sel.includes(p.id));
  return (
    <>
      <PageHead title="Patients" sub={q ? "Results for “" + q + "”" : "Search and filter patient records"} />
      <SearchBox defaultValue={sp.get("q") || ""} />
      <section className="panel flush" style={{ marginTop: 16 }}>
        <div className="ph">
          <h2>Patient records</h2>
          {sel.length > 0 && (
            <span role="status">
              {sel.length} selected{" "}
              <button className="link" onClick={() => setSel([])}>
                Clear
              </button>
            </span>
          )}
        </div>
        <div className="filters">
          {S("dept", "Department", depts)}
          {S("doctor", "Doctor", doctors)}
          {S("status", "Status", ["Stable", "Attention", "Under Observation", "Critical"])}
          {(f.dept || f.doctor || f.status) && (
            <button
              className="btn ghost sm"
              onClick={() => {
                setF({ dept: "", doctor: "", status: "" });
                setPg(0);
              }}
            >
              Clear filters
            </button>
          )}
        </div>
        {load ? (
          <Skel rows={5} />
        ) : rows.length ? (
          <div className="scroll">
            <table>
              <caption className="sr">Patients, {r.length} found</caption>
              <thead>
                <tr>
                  <th>
                    <input
                      type="checkbox"
                      aria-label="Select all on this page"
                      checked={all}
                      onChange={(e) =>
                        setSel(
                          e.target.checked
                            ? [...new Set([...sel, ...rows.map((p) => p.id)])]
                            : sel.filter((id) => !rows.some((p) => p.id === id)),
                        )
                      }
                    />
                  </th>
                  {TH("name", "Patient")}
                  {TH("dept", "Department")}
                  {TH("doctor", "Doctor")}
                  {TH("last", "Last visit")}
                  {TH("status", "Status")}
                  <th>
                    <span className="sr">Actions</span>
                  </th>
                </tr>
              </thead>
              <tbody>
                {rows.map((p) => (
                  <tr key={p.id} className={sel.includes(p.id) ? "sel" : ""}>
                    <td>
                      <input
                        type="checkbox"
                        aria-label={"Select " + p.name}
                        checked={sel.includes(p.id)}
                        onChange={(e) => setSel(e.target.checked ? [...sel, p.id] : sel.filter((x) => x !== p.id))}
                      />
                    </td>
                    <td>
                      <Who p={p} />
                    </td>
                    <td>{p.dept}</td>
                    <td>{p.doctor}</td>
                    <td>{p.last}</td>
                    <td>
                      <Badge s={p.status} />
                    </td>
                    <td>
                      <span className="tools">
                        <Link className="btn ghost sm" to={"/patients/" + p.id}>
                          View profile<span className="sr"> of {p.name}</span>
                        </Link>
                        {role === "Doctor" && (
                          <Link className="btn ghost sm" to={"/patients/" + p.id + "/prescribe"}>
                            New prescription<span className="sr"> for {p.name}</span>
                          </Link>
                        )}
                        <button
                          className="iconbtn sm"
                          data-tip="Send message"
                          aria-label={"Message about " + p.name}
                          onClick={() => toast("Message draft opened for " + p.name + ".")}
                        >
                          <MessageSquare size={16} aria-hidden="true" />
                        </button>
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <Empty t="No patients match. Try a shorter name or clear the filters." icon={Search} />
        )}
        <div className="pager" aria-live="polite">
          <span>
            {r.length} patient(s) · page {cur + 1} of {pages}
          </span>
          <span className="tools">
            <button
              className="iconbtn sm"
              aria-label="Previous page"
              data-tip="Previous page"
              disabled={cur === 0}
              onClick={() => setPg(cur - 1)}
            >
              <ChevronLeft size={16} />
            </button>
            <button
              className="iconbtn sm"
              aria-label="Next page"
              data-tip="Next page"
              disabled={cur >= pages - 1}
              onClick={() => setPg(cur + 1)}
            >
              <ChevronRight size={16} />
            </button>
          </span>
        </div>
      </section>
    </>
  );
}
const LabList = ({ pid }) => {
  const L = labs.filter((l) => l.pid === pid);
  return L.length ? (
    <ul className="labs">
      {L.map((l) => (
        <li key={l.name}>
          <span>
            <b>{l.name}</b>
            <small>{l.st === "Processing" ? "Processing · " + l.pr + "% · " + l.when : l.when}</small>
          </span>
          <Badge s={l.st} />
          <div
            className="prog"
            role="progressbar"
            aria-valuenow={l.pr}
            aria-valuemin="0"
            aria-valuemax="100"
            aria-label={l.name + " " + l.st}
          >
            <i style={{ width: l.pr + "%" }} />
          </div>
          <span className="tools" style={{ gridColumn: "span 2" }}>
            <button className="btn ghost sm" disabled={l.st === "Processing"}>
              View report
            </button>
            <button className="btn tertiary sm" disabled={l.st === "Processing"}>
              Download
            </button>
          </span>
        </li>
      ))}
    </ul>
  ) : (
    <Empty t="No reports yet" sub="Reports will appear here when they are uploaded." />
  );
};
export function Profile() {
  const { id } = useParams();
  const p = pt(id);
  const [tab, setTab] = useState("Overview");
  const { ask, toast, role } = useApp();
  const load = useLoad(500);
  if (!p) return <Empty t="Patient not found." />;
  const T = ["Overview", "Appointments", "Medical History", "Prescriptions", "Lab Reports", "Billing"];
  const x = p;
  const hasAl = p.allergies[0] !== "None known";
  const key = (e) => {
    const i = T.indexOf(tab);
    if (e.key === "ArrowRight" || e.key === "ArrowLeft") {
      const n = T[(i + (e.key === "ArrowRight" ? 1 : T.length - 1)) % T.length];
      setTab(n);
      document.getElementById("tab-" + n)?.focus();
    }
  };
  if (load)
    return (
      <>
        <Skel rows={2} />
        <Skel rows={5} />
      </>
    );
  return (
    <>
      <header className="phead">
        <Avatar name={p.name} lg />
        <div>
          <h1>
            {p.name} <Badge s={p.status} />
          </h1>
          <dl className="facts">
            <div>
              <dt>Patient ID</dt>
              <dd>{p.id}</dd>
            </div>
            <div>
              <dt>Age</dt>
              <dd>{p.age} years</dd>
            </div>
            <div>
              <dt>Bed</dt>
              <dd>{p.bed || "Outpatient"}</dd>
            </div>
            <div>
              <dt>Blood group</dt>
              <dd>{p.bg}</dd>
            </div>
          </dl>
          <p className="mut ec">
            Emergency contact: {p.ec.n} · {p.ec.rel}
            {p.ec.ph && " · " + p.ec.ph}
          </p>
        </div>
      </header>
      {hasAl && (
        <div className="warnbar" role="note">
          <AlertTriangle size={18} aria-hidden="true" />
          <span>
            <b>Allergy:</b> {p.allergies.join(", ")}
            {p.note && (
              <>
                {" "}
                · <b>Emergency note:</b> {p.note}
              </>
            )}
          </span>
        </div>
      )}
      <div className="tabs" role="tablist" aria-label="Patient record sections" onKeyDown={key}>
        {T.map((t) => (
          <button
            key={t}
            id={"tab-" + t}
            role="tab"
            tabIndex={tab === t ? 0 : -1}
            aria-selected={tab === t}
            onClick={() => setTab(t)}
          >
            {t}
          </button>
        ))}
      </div>
      <div role="tabpanel" aria-labelledby={"tab-" + tab}>
        {tab === "Overview" && (
          <div className="grid2">
            <section className="panel">
              <h2>Medical summary</h2>
              <dl className="sum">
                <dt>Allergies</dt>
                <dd className={hasAl ? "alert" : ""}>{p.allergies.join(", ")}</dd>
                <dt>Current medications</dt>
                <dd>{p.meds.join("; ")}</dd>
                <dt>Blood group</dt>
                <dd>{p.bg}</dd>
                <dt>Previous conditions</dt>
                <dd>{p.conditions.join(", ")}</dd>
                <dt>Emergency notes</dt>
                <dd>{p.note || "None recorded"}</dd>
              </dl>
            </section>
            <div>
              <section className="panel">
                <h2>Latest vitals</h2>
                <div className="vit">
                  {Object.entries(p.vitals).map(([k, v]) => (
                    <div key={k}>
                      <small>{k}</small>
                      <strong>{v}</strong>
                    </div>
                  ))}
                </div>
              </section>
              <section className="panel">
                <h2>Lab reports</h2>
                <LabList pid={p.id} />
              </section>
            </div>
          </div>
        )}
        {tab === "Appointments" && (
          <section className="panel flush">
            <ApptTable list={A0.filter((a) => a.pid === p.id)} />
          </section>
        )}
        {tab === "Medical History" && (
          <section className="panel">
            <h2>History</h2>
            <ol className="tl wide">
              {p.hist.map(([d, t, x], i) => (
                <li key={i}>
                  <time>{d}</time>
                  <div>
                    <span className="tag">{evType(t)}</span> <b>{t}</b>
                    <small>{x}</small>
                  </div>
                </li>
              ))}
            </ol>
          </section>
        )}
        {tab === "Prescriptions" && (
          <section className="panel">
            <h2>Current prescriptions</h2>
            <ul className="feed">
              {p.meds.map((m) => (
                <li key={m} style={{ gridTemplateColumns: "1fr" }}>
                  {m}
                </li>
              ))}
            </ul>
            {role === "Doctor" && (
              <Link className="btn" to={"/patients/" + p.id + "/prescribe"}>
                <Plus size={16} aria-hidden="true" />
                New prescription
              </Link>
            )}
          </section>
        )}
        {tab === "Lab Reports" && (
          <section className="panel">
            <h2>Lab reports</h2>
            <LabList pid={p.id} />
            <button
              className="btn ghost"
              onClick={() =>
                ask({
                  title: "Share patient report?",
                  body: "Recipient: Dr. Sharma. Only authorized medical staff can access this record.",
                  label: "Share securely",
                  ok: () => toast("Report shared securely."),
                })
              }
            >
              <Lock size={16} aria-hidden="true" />
              Share securely
            </button>
          </section>
        )}
        {tab === "Billing" && (
          <section className="panel flush">
            <div className="scroll">
              <table>
                <thead>
                  <tr>
                    <th>Invoice</th>
                    <th>Item</th>
                    <th>Amount</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {bills.map((b) => (
                    <tr key={b[0]}>
                      <td>{b[0]}</td>
                      <td>{b[1]}</td>
                      <td className="num">{b[2]}</td>
                      <td>
                        <Badge s={b[3]} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        )}
      </div>
    </>
  );
}
export function Prescribe() {
  const { id } = useParams();
  const p = pt(id);
  const { toast } = useApp();
  const nav = useNavigate();
  const [rows, setR] = useState([]);
  const [f, setF] = useState({ med: "", dose: "5 mg", freq: "Once daily", dur: "7 days", note: "" });
  const [err, setE] = useState("");
  const add = () => {
    if (!meds.includes(f.med)) {
      setE("Choose a medication from the list.");
      return;
    }
    setE("");
    setR([...rows, f]);
    setF({ ...f, med: "" });
  };
  return (
    <>
      <h1>Prescription for {p.name}</h1>
      <p>
        <b>Allergies: {p.allergies.join(", ")}</b>
      </p>
      <section className="panel">
        <div className="form">
          <label>
            Medication
            <input list="m" value={f.med} onChange={(e) => setF({ ...f, med: e.target.value })} aria-invalid={!!err} />
            <datalist id="m">
              {meds.map((m) => (
                <option key={m}>{m}</option>
              ))}
            </datalist>
          </label>
          <label>
            Dosage
            <select value={f.dose} onChange={(e) => setF({ ...f, dose: e.target.value })}>
              {["5 mg", "10 mg", "250 mg", "500 mg"].map((x) => (
                <option key={x}>{x}</option>
              ))}
            </select>
          </label>
          <label>
            Frequency
            <select value={f.freq} onChange={(e) => setF({ ...f, freq: e.target.value })}>
              {["Once daily", "Twice daily", "Three times daily", "As needed"].map((x) => (
                <option key={x}>{x}</option>
              ))}
            </select>
          </label>
          <label>
            Duration
            <select value={f.dur} onChange={(e) => setF({ ...f, dur: e.target.value })}>
              {["3 days", "7 days", "14 days", "30 days"].map((x) => (
                <option key={x}>{x}</option>
              ))}
            </select>
          </label>
          <label>
            Instructions
            <select value={f.note} onChange={(e) => setF({ ...f, note: e.target.value })}>
              {["", "After food", "Before food", "At bedtime"].map((x) => (
                <option key={x}>{x}</option>
              ))}
            </select>
          </label>
        </div>
        {err && (
          <p className="err" role="alert">
            {err}
          </p>
        )}
        <button className="btn" onClick={add}>
          <Plus size={16} /> Add medication
        </button>
      </section>
      <section className="panel">
        <h2>Prescription preview</h2>
        {rows.length ? (
          <ol>
            {rows.map((r, i) => (
              <li key={i}>
                {r.med} {r.dose} – {r.freq}, {r.dur} {r.note && "– " + r.note}{" "}
                <button
                  className="btn sm ghost"
                  onClick={() => {
                    setF(r);
                    setR(rows.filter((_, j) => j !== i));
                  }}
                >
                  Edit
                </button>{" "}
                <button
                  className="btn sm ghost"
                  aria-label={"Remove " + r.med}
                  onClick={() => setR(rows.filter((_, j) => j !== i))}
                >
                  <Trash2 size={14} /> Remove
                </button>
              </li>
            ))}
          </ol>
        ) : (
          <Empty t="No medications added yet." />
        )}
        <button
          className="btn"
          disabled={!rows.length}
          onClick={() => {
            toast("Prescription saved.");
            nav("/patients/" + id);
          }}
        >
          Save prescription
        </button>
      </section>
    </>
  );
}
export function Appointments() {
  const { role, ask, toast } = useApp();
  const { appts: list, setAppts: setL } = useApp();
  const [f, setF] = useState({ pid: ME_PID, doctor: QUEUE.doctor, date: TODAY, time: "" });
  const [ed, setEd] = useState(null);
  const busy = (doc, date, t, skip) => isBooked(list, doc, date, t, skip);
  const visible = [...(role === "Patient" ? list.filter((a) => a.pid === ME_PID) : list)].sort((a, b) =>
    (a.date + a.time).localeCompare(b.date + b.time),
  );
  const pick = (k, v) => {
    const g = { ...f, [k]: v };
    if (busy(g.doctor, g.date, g.time)) g.time = "";
    setF(g);
  };
  const book = () => {
    if (!f.time) return toast("Select an available time slot first.");
    const n = {
      id: Date.now(),
      pid: role === "Patient" ? ME_PID : f.pid,
      time: f.time,
      date: f.date,
      reason: "New consultation",
      status: "Confirmed",
      doctor: f.doctor,
      dept: DOCDEPT[f.doctor],
    };
    setL([...list, n]);
    setF({ ...f, time: "" });
    toast(
      "Appointment confirmed · " + n.doctor + " · " + n.dept + " · " + fd(n.date) + " · " + fmtTime(n.time) + ".",
      () => setL((l) => l.filter((x) => x.id !== n.id)),
    );
  };
  return (
    <>
      <PageHead
        title="Appointments"
        sub={
          (role === "Patient" ? "Your upcoming and past visits" : "Book, reschedule or cancel") +
          " · Last updated " +
          NOW
        }
      />
      {
        <section className="panel">
          <h2>Book an appointment</h2>
          <div className="form">
            {role !== "Patient" && (
              <label>
                Patient
                <select value={f.pid} onChange={(e) => pick("pid", e.target.value)}>
                  {patients.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name} ({p.id})
                    </option>
                  ))}
                </select>
              </label>
            )}
            <label>
              Doctor
              <select value={f.doctor} onChange={(e) => pick("doctor", e.target.value)}>
                {doctors.map((d) => (
                  <option key={d} value={d}>
                    {d} · {DOCDEPT[d]}
                  </option>
                ))}
              </select>
            </label>
            <label>
              Date
              <input type="date" value={f.date} onChange={(e) => pick("date", e.target.value)} />
            </label>
          </div>
          <SlotPicker list={list} doctor={f.doctor} date={f.date} value={f.time} onPick={(t) => pick("time", t)} />
          <button className="btn" onClick={book}>
            Book appointment
          </button>
        </section>
      }
      <section className="panel flush">
        <div className="ph">
          <h2>Schedule</h2>
        </div>
        {visible.length ? (
          <div className="scroll">
            <table>
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Time</th>
                  <th>Patient</th>
                  <th>Doctor</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {visible.map((a) => (
                  <tr key={a.id}>
                    <td>{fd(a.date)}</td>
                    <td className="num">
                      {ed === a.id ? (
                        <select
                          aria-label="New time"
                          defaultValue=""
                          onChange={(e) => {
                            const old = a.time;
                            setL((l) => l.map((x) => (x.id === a.id ? { ...x, time: e.target.value } : x)));
                            setEd(null);
                            toast("Appointment rescheduled to " + e.target.value + ".", () =>
                              setL((l) => l.map((x) => (x.id === a.id ? { ...x, time: old } : x))),
                            );
                          }}
                        >
                          <option value="" disabled>
                            Pick…
                          </option>
                          {slots
                            .filter((t) => !busy(a.doctor, a.date, t, a.id))
                            .map((t) => (
                              <option key={t}>{t}</option>
                            ))}
                        </select>
                      ) : (
                        a.time
                      )}
                    </td>
                    <td>
                      <Who p={pt(a.pid)} />
                    </td>
                    <td>
                      {a.doctor}
                      <small>{ROOM[a.doctor]}</small>
                    </td>
                    <td>
                      <Badge s={a.status} />
                    </td>
                    <td>
                      <span className="tools">
                        {!["Cancelled", "Completed"].includes(a.status) && (
                          <>
                            {ed === a.id ? (
                              <button className="btn ghost sm" onClick={() => setEd(null)}>
                                Keep time
                              </button>
                            ) : (
                              <button className="btn ghost sm" onClick={() => setEd(a.id)}>
                                Reschedule
                              </button>
                            )}
                            <button
                              className="btn ghost sm danger-t"
                              onClick={() =>
                                ask({
                                  title: "Cancel this appointment?",
                                  body:
                                    pt(a.pid).name +
                                    " · " +
                                    fd(a.date) +
                                    " " +
                                    a.time +
                                    " with " +
                                    a.doctor +
                                    ". The slot will be released.",
                                  label: "Cancel appointment",
                                  danger: true,
                                  ok: () => {
                                    setL((l) => l.map((x) => (x.id === a.id ? { ...x, status: "Cancelled" } : x)));
                                    toast("Appointment cancelled.", () =>
                                      setL((l) => l.map((x) => (x.id === a.id ? { ...x, status: a.status } : x))),
                                    );
                                  },
                                })
                              }
                            >
                              Cancel
                            </button>
                          </>
                        )}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <Empty t="No appointments scheduled" sub="Appointments will appear here when they are booked." />
        )}
      </section>
    </>
  );
}
export function Queue() {
  const { role, toast, qcur, setQ } = useApp();
  const mine = QUEUE.mine;
  const ahead = Math.max(mine - qcur, 0);
  const ids = [];
  for (let k = qcur; k <= mine; k++) ids.push(k);
  const Ladder = (
    <ol className="ladder" aria-label="Queue order">
      {ids.map((k) => (
        <li key={k} className={k === qcur ? "serving" : k === mine && role === "Patient" ? "you" : ""}>
          <b>A{k}</b>
          <span>{k === qcur ? "● Serving" : k === mine && role === "Patient" ? "→ You" : "○ Waiting"}</span>
        </li>
      ))}
    </ol>
  );
  if (role === "Patient")
    return (
      <>
        <PageHead
          title="Your queue status"
          sub={QUEUE.doctor + " · " + DOCDEPT[QUEUE.doctor] + " · " + ROOM[QUEUE.doctor]}
        />
        <section className="panel" aria-live="polite">
          <p className="lbl">YOUR POSITION</p>
          <p className="xl" style={{ fontSize: "2.4rem" }}>
            A{mine}
          </p>
          <div className="kpis" style={{ marginTop: 16 }}>
            <Stat icon={Hash} n={"A" + qcur} l="Currently serving" />
            <Stat icon={Users} n={ahead} l="Patients ahead of you" />
            <Stat icon={Clock} n={ahead * QUEUE.perPatient + " min"} l="Estimated waiting time" />
          </div>
          {ahead === 0 && (
            <p>
              <b>It is your turn.</b> Please go to {ROOM[QUEUE.doctor]}.
            </p>
          )}
          {Ladder}
          <p className="note">We will notify you when it is almost your turn. Last updated {QUEUE.updated}.</p>
        </section>
      </>
    );
  return (
    <>
      <PageHead title="Smart queue" sub={QUEUE.doctor + " · " + DOCDEPT[QUEUE.doctor]} />
      <div className="kpis">
        <Stat icon={Hash} n={"A" + qcur} l="Currently serving" />
        <Stat icon={Hash} n={ahead > 0 ? "A" + (qcur + 1) : "—"} l="Next patient" />
        <Stat icon={Users} n={ahead} l="Patients waiting" tone={ahead ? "warn" : ""} />
        <Stat icon={Clock} n={ahead * QUEUE.perPatient + " min"} l="Estimated wait for last patient" />
      </div>
      <section className="panel">
        {Ladder}
        <button
          className="btn lg"
          disabled={ahead === 0}
          onClick={() => {
            setQ(qcur + 1);
            toast("Now serving A" + (qcur + 1) + ".", () => setQ(qcur));
          }}
        >
          <PhoneCall size={18} aria-hidden="true" />
          {ahead > 0 ? "Call A" + (qcur + 1) : "Queue is empty"}
        </button>
      </section>
    </>
  );
}
const bedP = (id) => patients.find((p) => p.id === id);
const cls = (st) => "s-" + st.replace(/\s/g, "-").toLowerCase();
export function Wards() {
  const { toast, acks, ack } = useApp();
  const crit = patients.find((p) => p.status === "Critical");
  return (
    <>
      <PageHead title="Ward overview" sub={dateLine() + " · Ward A and ICU"} />
      <Emergency
        p={crit}
        ack={acks.AL1}
        onAck={() => {
          ack("AL1");
          toast("Alert acknowledged. The condition is still critical.");
        }}
      />
      <Quick role="Nurse" />
      <div className="legend" aria-label="Legend">
        <span>⚠ Critical: red outline</span>
        <span>▲ Attention / observation: dashed</span>
        <span>✔ Stable</span>
        <span>○ Vacant</span>
      </div>
      <div className="grid">
        {BEDS.map(([b, pid]) => {
          const p = bedP(pid);
          const st = p ? p.status : "Empty";
          return (
            <div key={b} className={"bed " + cls(st)}>
              <div className="bed-id">{b}</div>
              <div>{p ? p.name : "Vacant"}</div>
              <Badge s={st} />
              {p && (
                <p className="bed-v">
                  SpO₂ <b>{p.vitals.SpO2}</b>
                </p>
              )}
            </div>
          );
        })}
      </div>
      <section className="panel soft" style={{ marginTop: 24 }}>
        <h2>Medication due soon</h2>
        {MEDS.filter((m) => m.st === "Due" || m.st === "Missed").map((m) => (
          <p key={m.id}>
            {m.time} · <b>{bedP(m.pid).name}</b> · {m.med} {m.dose} <Badge s={m.st} />
          </p>
        ))}
        <Link className="btn ghost sm" to="/medication">
          Open medication list
        </Link>
      </section>
    </>
  );
}
const ward = patients.filter((p) => p.bed);
export function Vitals() {
  const lvl = (v) => {
    const n = parseInt(v);
    return n < 90 ? "crit" : n < 95 ? "warn" : "";
  };
  return (
    <>
      <PageHead title="Vitals" sub={"Ward A and ICU · last recorded " + H.vitalsRecorded} />
      <section className="panel flush">
        <div className="scroll">
          <table>
            <caption className="sr">Inpatient vitals</caption>
            <thead>
              <tr>
                <th>Patient</th>
                <th>Bed</th>
                <th>SpO₂</th>
                <th>BP</th>
                <th>HR</th>
                <th>Temp</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {ward.map((p) => {
                const L = lvl(p.vitals.SpO2);
                return (
                  <tr key={p.id} className={L === "crit" ? "rowcrit" : ""}>
                    <td>
                      <Who p={p} />
                    </td>
                    <td>{p.bed}</td>
                    <td className={"v " + L}>
                      {L && <span aria-hidden="true">{L === "crit" ? "⚠ " : "▲ "}</span>}
                      {p.vitals.SpO2}
                    </td>
                    <td>{p.vitals.BP}</td>
                    <td>{p.vitals.HR}</td>
                    <td>{p.vitals.Temp}</td>
                    <td>
                      <Badge s={p.status} />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>
      <p className="note">SpO₂ below 95% is flagged ▲; below 90% is flagged ⚠.</p>
    </>
  );
}
export function Medication() {
  const { toast } = useApp();
  const [L, setL] = useState(MEDS);
  const set = (id, st) => setL((l) => l.map((m) => (m.id === id ? { ...m, st } : m)));
  return (
    <>
      <PageHead title="Medication" sub={"Administration schedule · now " + NOW} />
      <section className="panel flush">
        <div className="scroll">
          <table>
            <thead>
              <tr>
                <th>Patient</th>
                <th>Medication</th>
                <th>Dose</th>
                <th>Time</th>
                <th>Status</th>
                <th>
                  <span className="sr">Action</span>
                </th>
              </tr>
            </thead>
            <tbody>
              {L.map((m) => (
                <tr key={m.id}>
                  <td>
                    <Who p={bedP(m.pid)} />
                  </td>
                  <td>{m.med}</td>
                  <td>{m.dose}</td>
                  <td className="num">{m.time}</td>
                  <td>
                    <Badge s={m.st} />
                  </td>
                  <td>
                    {m.st === "Administered" ? (
                      <span className="mut">Done</span>
                    ) : (
                      <button
                        className="btn ghost sm"
                        onClick={() => {
                          const old = m.st;
                          set(m.id, "Administered");
                          toast(m.med + " marked as administered for " + bedP(m.pid).name + ".", () => set(m.id, old));
                        }}
                      >
                        <Check size={16} aria-hidden="true" />
                        Mark as administered
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </>
  );
}
export function Alerts() {
  const { acks, ack, toast } = useApp();
  return (
    <>
      <PageHead
        title="Alerts"
        sub="Highest severity first. Acknowledging confirms you have seen an alert; it does not resolve the condition."
      />
      {ALERTS.map((a) => {
        const p = bedP(a.pid);
        const k = acks[a.id];
        const crit = a.sev === "Critical";
        return (
          <section key={a.id} className={"panel alertrow " + (crit ? "crit" : "")}>
            <div>
              <Badge s={a.sev} />
              <h2 style={{ margin: "8px 0 2px" }}>
                {p.name} · {p.bed}
              </h2>
              <p className="big2">{a.text}</p>
              <small>
                First raised {a.first} · last recorded {a.last}
              </small>
              {k && (
                <p className="ackd">
                  ✔ Alert acknowledged by {k.by} · {k.time}
                  {crit ? " · condition still critical" : ""}
                </p>
              )}
            </div>
            <div className="row">
              <Link className="btn ghost" to={"/patients/" + p.id}>
                View patient
              </Link>
              {!k && (
                <button
                  className="btn"
                  onClick={() => {
                    ack(a.id);
                    toast("Alert acknowledged. The condition is not resolved.");
                  }}
                >
                  Acknowledge
                </button>
              )}
            </div>
          </section>
        );
      })}
    </>
  );
}
export function Messages() {
  const { role, toast } = useApp();
  const me = ROLE[role].name;
  const list = convos.filter((c) => c.name !== me && (role !== "Patient" || c.pat));
  const [data, setD] = useState(convos);
  const [sel, setS] = useState(list[0].id);
  const [read, setRead] = useState([list[0].id]);
  const [t, setT] = useState("");
  const c = data.find((x) => x.id === sel);
  const open = (id) => {
    setS(id);
    setRead((r) => (r.includes(id) ? r : [...r, id]));
  };
  return (
    <>
      <PageHead title="Messages" sub="Internal hospital communication" />
      <div className="conv">
        <nav aria-label="Conversations">
          <ul>
            {list.map((x) => {
              const d = data.find((y) => y.id === x.id);
              const last = d.msgs[d.msgs.length - 1];
              const unread = d.unread && !read.includes(x.id);
              return (
                <li key={x.id}>
                  <button aria-current={sel === x.id} onClick={() => open(x.id)}>
                    <Avatar name={x.name} />
                    <span className="grow">
                      <b>{x.name}</b>
                      <small>
                        {x.sub} · {last[2]}
                      </small>
                      <small>{last[1].slice(0, 36)}…</small>
                    </span>
                    {unread && <span className="udot" role="img" aria-label="Unread messages" />}
                  </button>
                </li>
              );
            })}
          </ul>
        </nav>
        <section aria-label={"Conversation with " + c.name}>
          <header>
            <b>{c.name}</b>
            <small>{c.sub}</small>
          </header>
          <ul className="thread">
            {c.msgs.map((m, i) => (
              <li key={i} className={m[0] === "me" ? "me" : ""}>
                <small>
                  {m[0] === "me" ? "You" : c.name} · {m[2]}
                </small>
                <p>{m[1]}</p>
              </li>
            ))}
          </ul>
          <form
            className="compose"
            onSubmit={(e) => {
              e.preventDefault();
              if (!t.trim()) return;
              setD(
                data.map((x) =>
                  x.id === sel ? { ...x, msgs: [...x.msgs, ["me", t.trim(), NOW.replace(" AM", "")]] } : x,
                ),
              );
              setT("");
              toast("Message sent.");
            }}
          >
            <label className="sr" htmlFor="msg">
              Write a message
            </label>
            <input
              id="msg"
              className="grow"
              value={t}
              onChange={(e) => setT(e.target.value)}
              placeholder="Write a message…"
            />
            <button className="btn">
              <Send size={16} aria-hidden="true" />
              Send
            </button>
          </form>
        </section>
      </div>
    </>
  );
}
export function Notifications() {
  const { ns, setNs } = useApp();
  return (
    <>
      <PageHead title="Notifications" sub={ns.filter((n) => n.unread).length + " unread"}>
        <button className="btn ghost" onClick={() => setNs(ns.map((n) => ({ ...n, unread: false })))}>
          Mark all as read
        </button>
      </PageHead>
      <section className="panel flush">
        {ns.length ? (
          <ul className="feed" style={{ padding: "0 20px" }}>
            {ns.map((n) => (
              <li key={n.id} style={{ gridTemplateColumns: "90px 1fr auto" }}>
                <time>{n.time}</time>
                <span>
                  <small>{n.cat}</small>
                  {n.text}
                </span>
                {n.unread && <Badge s="Pending" />}
              </li>
            ))}
          </ul>
        ) : (
          <Empty t="No notifications" />
        )}
      </section>
    </>
  );
}
export function Registration() {
  const { toast, ask, appts, setAppts } = useApp();
  const nav = useNavigate();
  const [s, setS] = useState(0);
  const E0 = {
    name: "",
    dob: "",
    gender: "",
    bg: "",
    phone: "",
    email: "",
    ec: "",
    allergies: "",
    cond: "",
    meds: "",
    surg: "",
    enotes: "",
    dept: "",
    doctor: "",
    date: TODAY,
    slot: "",
  };
  const [f, setF] = useState(E0);
  const [t, setT] = useState({});
  const set = (k, v) => {
    const g = { ...f, [k]: v };
    if (k === "dept" && g.doctor && DOCDEPT[g.doctor] !== v) g.doctor = "";
    if (isBooked(appts, g.doctor, g.date, g.slot)) g.slot = "";
    setF(g);
  };
  const R = {
    name: (v) => (v.trim() ? "" : "Enter the patient’s full name."),
    dob: (v) => (v ? "" : "Select the date of birth."),
    gender: (v) => (v ? "" : "Select a gender."),
    phone: (v) => (valid10(v) ? "" : "Phone number must contain 10 digits."),
    email: (v) => (!v || /^\S+@\S+\.\S+$/.test(v) ? "" : "Enter a valid email, for example name@example.com."),
    ec: (v) => (v.trim() ? "" : "Enter an emergency contact name and number."),
    dept: (v) => (v ? "" : "Choose a department."),
    doctor: (v) => (v ? "" : "Choose a doctor."),
    date: (v) => (!v ? "Select an appointment date." : v < TODAY ? "Choose today or a later date." : ""),
    slot: (v) =>
      !v
        ? "Choose an available time slot."
        : isBooked(appts, f.doctor, f.date, v)
          ? "That slot is no longer available. Choose another time."
          : "",
  };
  const STEPS = ["Patient details", "Medical information", "Appointment", "Confirmation"];
  const FIELDS = [["name", "dob", "gender", "phone", "email", "ec"], [], ["dept", "doctor", "date", "slot"], []];
  const err = (k) => (R[k] ? R[k](f[k]) : "");
  const dirty = Object.entries(f).some(([k, v]) => v && E0[k] !== v);
  const next = () => {
    setT({ ...t, ...Object.fromEntries(FIELDS[s].map((k) => [k, 1])) });
    if (!FIELDS[s].some(err)) setS(s + 1);
  };
  const reset = () => {
    setF(E0);
    setT({});
    setS(0);
  };
  const confirm = () => {
    if (err("slot")) {
      setS(2);
      setT({ ...t, slot: 1 });
      return toast("That time is no longer available. Please choose another slot.");
    }
    const p = addPatient(f);
    setAppts([
      ...appts,
      {
        id: Date.now(),
        pid: p.id,
        date: f.date,
        time: f.slot,
        reason: "New patient consultation",
        status: "Confirmed",
        doctor: f.doctor,
        dept: f.dept,
      },
    ]);
    toast("Patient registered. ID " + p.id + " · appointment " + fd(f.date) + " " + f.slot + " with " + f.doctor + ".");
    reset();
  };
  const F = (k, l, o = {}) => {
    const e = t[k] && err(k);
    const id = "f-" + k;
    return (
      <label htmlFor={id}>
        {l}
        {o.req && (
          <span className="req" aria-hidden="true">
            {" "}
            *
          </span>
        )}
        {o.opts ? (
          <select
            id={id}
            value={f[k]}
            disabled={o.disabled}
            aria-required={!!o.req}
            aria-invalid={!!e}
            onChange={(x) => set(k, x.target.value)}
          >
            <option value="">{o.disabled ? o.hint : "Select…"}</option>
            {o.opts.map((x) => (
              <option key={x}>{x}</option>
            ))}
          </select>
        ) : (
          <input
            id={id}
            type={o.type || "text"}
            min={o.min}
            value={f[k]}
            placeholder={o.ph}
            aria-required={!!o.req}
            aria-invalid={!!e}
            onChange={(x) => set(k, x.target.value)}
            onBlur={() => setT({ ...t, [k]: 1 })}
          />
        )}
        {e && (
          <span className="err" role="alert">
            {e}
          </span>
        )}
      </label>
    );
  };
  return (
    <>
      <PageHead title="Register patient" sub="Fields marked * are required." />
      <ol className="stepper" aria-label="Registration progress">
        {STEPS.map((x, i) => (
          <li key={x} className={i < s ? "done" : i === s ? "now" : ""} aria-current={i === s ? "step" : undefined}>
            <span>{i < s ? "✔" : i + 1}</span>
            {x}
          </li>
        ))}
      </ol>
      <section className="panel">
        {s === 0 && (
          <>
            <fieldset>
              <legend>Patient information</legend>
              <div className="form">
                {F("name", "Full name", { req: 1, ph: "e.g. Meera Nair" })}
                {F("dob", "Date of birth", { req: 1, type: "date" })}
                {F("gender", "Gender", { req: 1, opts: ["Female", "Male", "Other"] })}
                {F("bg", "Blood group", { opts: ["A+", "A−", "B+", "B−", "AB+", "AB−", "O+", "O−"] })}
              </div>
            </fieldset>
            <fieldset>
              <legend>Contact information</legend>
              <div className="form">
                {F("phone", "Phone", { req: 1, ph: "10 digits" })}
                {F("email", "Email", { ph: "name@example.com" })}
                {F("ec", "Emergency contact", { req: 1, ph: "Name and phone number" })}
              </div>
            </fieldset>
          </>
        )}
        {s === 1 && (
          <>
            <fieldset>
              <legend>Allergies and conditions</legend>
              <div className="form">
                {F("allergies", "Known allergies", { ph: "e.g. Penicillin, or “None known”" })}
                {F("cond", "Existing conditions", { ph: "e.g. Hypertension" })}
              </div>
            </fieldset>
            <fieldset>
              <legend>Medications and history</legend>
              <div className="form">
                {F("meds", "Current medications", { ph: "e.g. Amlodipine 5 mg daily" })}
                {F("surg", "Previous surgeries", { ph: "e.g. Appendectomy, 2018" })}
                {F("enotes", "Emergency notes", { ph: "e.g. Oxygen support if SpO₂ < 90%" })}
              </div>
              <p className="note">
                All fields are optional. Allergies and emergency notes appear as a warning on the patient’s profile.
              </p>
            </fieldset>
          </>
        )}
        {s === 2 && (
          <fieldset>
            <legend>First appointment</legend>
            <div className="form">
              {F("dept", "Department", { req: 1, opts: depts })}
              {F("doctor", "Doctor", {
                req: 1,
                opts: doctors.filter((d) => !f.dept || DOCDEPT[d] === f.dept),
                disabled: !f.dept,
                hint: "Choose a department first",
              })}
              {F("date", "Date", { req: 1, type: "date", min: TODAY })}
            </div>
            {f.doctor && f.date ? (
              <SlotPicker
                list={appts}
                doctor={f.doctor}
                date={f.date}
                value={f.slot}
                onPick={(v) => set("slot", v)}
                error={t.slot && err("slot")}
              />
            ) : (
              <p className="note" style={{ marginTop: 16 }}>
                Choose a department, doctor and date to see available times.
              </p>
            )}
          </fieldset>
        )}
        {s === 3 && (
          <fieldset>
            <legend>Review and confirm</legend>
            <dl className="sum">
              <dt>Name</dt>
              <dd>{f.name}</dd>
              <dt>Date of birth</dt>
              <dd>{f.dob}</dd>
              <dt>Phone</dt>
              <dd>{f.phone}</dd>
              <dt>Emergency contact</dt>
              <dd>{f.ec}</dd>
              <dt>Allergies</dt>
              <dd>{f.allergies || "None recorded"}</dd>
              <dt>Appointment</dt>
              <dd>
                {fd(f.date)} · {f.slot} · {f.doctor} · {f.dept}
              </dd>
            </dl>
          </fieldset>
        )}
        <div className="row end">
          <button
            className="btn ghost"
            onClick={() =>
              dirty
                ? ask({
                    title: "Discard this registration?",
                    body: "The details you entered will be cleared.",
                    label: "Discard",
                    danger: true,
                    ok: reset,
                  })
                : nav("/dashboard")
            }
          >
            Cancel
          </button>
          {s > 0 && (
            <button className="btn ghost" onClick={() => setS(s - 1)}>
              Back
            </button>
          )}
          {s < 3 ? (
            <button className="btn" onClick={next}>
              Next
            </button>
          ) : (
            <button className="btn" onClick={confirm}>
              Register patient
            </button>
          )}
        </div>
      </section>
    </>
  );
}
export function Reports() {
  const { role, toast } = useApp();
  const [q, setQ] = useState("");
  const [st, setSt] = useState("");
  const [dp, setDp] = useState("");
  const [dt, setDt] = useState("");
  const [pg, setPg] = useState(0);
  const load = useLoad(500);
  const PS = 5;
  const r = labs.filter(
    (l) =>
      (role !== "Patient" || l.pid === ME_PID) &&
      (!q || (l.name + pt(l.pid).name).toLowerCase().includes(q.toLowerCase())) &&
      (!st || l.st === st) &&
      (!dp || l.dept === dp) &&
      (!dt || l.date === dt),
  );
  const pages = Math.max(1, Math.ceil(r.length / PS));
  const cur = Math.min(pg, pages - 1);
  const rs = (fn) => (e) => {
    fn(e.target.value);
    setPg(0);
  };
  return (
    <>
      <PageHead title={role === "Patient" ? "My reports" : "Lab reports"} sub="Search and open reports" />
      <section className="panel flush">
        <div className="filters" style={{ paddingTop: 16 }}>
          <label style={{ flex: 1 }}>
            Search
            <input value={q} onChange={rs(setQ)} placeholder="Report or patient name" />
          </label>
          <label>
            Status
            <select value={st} onChange={rs(setSt)}>
              <option value="">All</option>
              {["Completed", "Processing", "Ready for review"].map((x) => (
                <option key={x}>{x}</option>
              ))}
            </select>
          </label>
          <label>
            Department
            <select value={dp} onChange={rs(setDp)}>
              <option value="">All</option>
              {depts.map((x) => (
                <option key={x}>{x}</option>
              ))}
            </select>
          </label>
          <label>
            Date
            <input type="date" value={dt} onChange={rs(setDt)} />
          </label>
        </div>
        {load ? (
          <Skel rows={4} />
        ) : r.length ? (
          <div className="scroll">
            <table>
              <thead>
                <tr>
                  <th>Report</th>
                  <th>Patient</th>
                  <th>Department</th>
                  <th>Date</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {r.slice(cur * PS, cur * PS + PS).map((l) => (
                  <tr key={l.id}>
                    <td>
                      <b>{l.name}</b>
                      {l.st !== "Processing" && <small>{l.when}</small>}
                    </td>
                    <td>
                      <Who p={pt(l.pid)} />
                    </td>
                    <td>{l.dept}</td>
                    <td>{fd(l.date)}</td>
                    <td>
                      <Badge s={l.st} />
                      {l.st === "Processing" && (
                        <small>
                          {l.pr}% · {l.when}
                        </small>
                      )}
                    </td>
                    <td>
                      <span className="tools">
                        <button
                          className="btn ghost sm"
                          disabled={l.st === "Processing"}
                          onClick={() => toast(l.name + " opened (demo).")}
                        >
                          View
                        </button>
                        <button
                          className="iconbtn sm"
                          data-tip="Download report"
                          aria-label={"Download " + l.name}
                          disabled={l.st === "Processing"}
                          onClick={() => toast(l.name + " downloaded (demo).")}
                        >
                          <Download size={16} aria-hidden="true" />
                        </button>
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <Empty
            t={labs.length ? "No reports match these filters" : "No reports yet"}
            sub={labs.length ? "Try clearing a filter." : "Reports will appear here when they are uploaded."}
          />
        )}
        <div className="pager">
          <span>
            {r.length} report(s) · page {cur + 1} of {pages}
          </span>
          <span className="tools">
            <button
              className="iconbtn sm"
              aria-label="Previous page"
              disabled={cur === 0}
              onClick={() => setPg(cur - 1)}
            >
              <ChevronLeft size={16} />
            </button>
            <button
              className="iconbtn sm"
              aria-label="Next page"
              disabled={cur >= pages - 1}
              onClick={() => setPg(cur + 1)}
            >
              <ChevronRight size={16} />
            </button>
          </span>
        </div>
      </section>
    </>
  );
}
export function Prescriptions() {
  const p = pt(ME_PID);
  return (
    <>
      <PageHead title="Prescriptions" sub={"Prescribed by " + pt(ME_PID).doctor} />
      <section className="panel">
        {p.meds.length ? (
          <ul className="feed">
            {p.meds.map((m) => (
              <li key={m} style={{ gridTemplateColumns: "1fr" }}>
                {m}
              </li>
            ))}
          </ul>
        ) : (
          <Empty t="No prescriptions yet" sub="Prescriptions will appear here after a consultation." />
        )}
      </section>
    </>
  );
}
export function Admin() {
  const { toast } = useApp();
  return (
    <>
      <PageHead title="Hospital overview" sub={dateLine()}>
        <button className="btn ghost" onClick={() => toast("Daily summary exported (demo).")}>
          <FileText size={16} aria-hidden="true" />
          Export summary
        </button>
      </PageHead>
      <Emergency />
      <Quick role="Administrator" />
      <div className="kpis">
        <Stat
          icon={Users}
          n={H.patientsTotal.toLocaleString("en-US")}
          l="Total patients"
          ctx={"+" + H.patientsWeek + " this week"}
        />
        <Stat icon={Calendar} n={H.apptsToday} l="Today’s appointments" ctx={H.apptsDone + " completed"} />
        <Stat
          icon={BedDouble}
          n={H.bedsFree + " / " + H.bedsTotal}
          l="Available beds"
          ctx={H.bedsSoon + " beds becoming available today"}
        />
        <Stat
          icon={AlertTriangle}
          n={H.emergencyCases}
          l="Emergency cases"
          tone="crit"
          ctx={ALERTS.filter((a) => a.sev === "Critical").length + " critical"}
        />
        <Stat
          icon={Clock}
          n={H.avgWait + " min"}
          l="Average waiting time"
          ctx={H.waitDelta + " min shorter than last week"}
        />
        <Stat
          icon={Stethoscope}
          n={DOCS_ON + " / " + DOCS.length}
          l="Doctors on duty"
          ctx={NURSES_ON + " nurses on shift"}
        />
      </div>
      <div className="grid2">
        <Bar pct title="Bed occupancy" unit="%" items={H.occupancy} />
        <Depts />
      </div>
      <div className="grid2">
        <Duty />
        <Feed />
      </div>
    </>
  );
}
export function Staff() {
  const [f, setF] = useState("All");
  const rows = staff.filter((s) => f === "All" || s.role + "s" === f);
  return (
    <>
      <PageHead title="Staff" sub="Who is on shift now" />
      <section className="panel flush">
        <div className="ph">
          <h2>On shift · {NOW}</h2>
          <div className="chips" role="group" aria-label="Filter staff">
            {["All", "Doctors", "Nurses"].map((x) => (
              <button key={x} className="chip" aria-pressed={f === x} onClick={() => setF(x)}>
                {x}
              </button>
            ))}
          </div>
        </div>
        <div className="scroll">
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Role</th>
                <th>Department</th>
                <th>Room</th>
                <th>Shift</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((s) => (
                <tr key={s.n}>
                  <td>
                    <span className="pn">
                      <Avatar name={s.n} />
                      <b>{s.n}</b>
                    </span>
                  </td>
                  <td>{s.role}</td>
                  <td>{s.d}</td>
                  <td>{s.room}</td>
                  <td className="num">{s.shift}</td>
                  <td>
                    <Badge s={s.st} />
                    {s.now && <small>{s.now}</small>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </>
  );
}
export function Resources() {
  const E = [
    ["Ventilators", 8, 6],
    ["Defibrillators", 10, 1],
    ["ECG machines", 12, 4],
    ["Infusion pumps", 40, 27],
    ["Wheelchairs", 30, 12],
  ];
  return (
    <>
      <PageHead title="Resources" sub="Beds, rooms and equipment" />
      <div className="kpis">
        <Stat
          icon={BedDouble}
          n={H.bedsFree + " / " + H.bedsTotal}
          l="Available beds"
          ctx={H.bedsTotal - H.bedsFree + " occupied"}
        />
        <Stat
          icon={BedDouble}
          n={H.icuFree + " / " + H.icuTotal}
          l="ICU beds free"
          tone="warn"
          ctx={H.occupancy[1][1] + "% occupied"}
        />
        <Stat icon={Siren} n={H.emergencyBedsFree} l="Emergency beds free" ctx={"of " + H.emergencyBedsTotal} />
      </div>
      <div className="grid2">
        <Bar pct title="Bed occupancy" unit="%" items={H.occupancy} />
        <section className="panel">
          <h2>Consultation rooms</h2>
          <div className="scroll">
            <table>
              <tbody>
                {doctors.map((d) => (
                  <tr key={d}>
                    <td>{ROOM[d]}</td>
                    <td>{DOCDEPT[d]}</td>
                    <td>{d}</td>
                    <td>
                      <Badge s={d === "Dr. Iyer" ? "In Consultation" : "Available"} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>
      <section className="panel flush">
        <div className="ph">
          <h2>Equipment</h2>
        </div>
        <div className="scroll">
          <table>
            <thead>
              <tr>
                <th>Item</th>
                <th>In use</th>
                <th>Available</th>
                <th>Usage</th>
              </tr>
            </thead>
            <tbody>
              {E.map(([n, t, u]) => (
                <tr key={n}>
                  <td>{n}</td>
                  <td>{u}</td>
                  <td>
                    {t - u} of {t}
                  </td>
                  <td style={{ minWidth: 160 }}>
                    <div
                      className="prog"
                      role="progressbar"
                      aria-valuenow={Math.round((u / t) * 100)}
                      aria-valuemin="0"
                      aria-valuemax="100"
                      aria-label={n + " in use"}
                    >
                      <i style={{ width: (u / t) * 100 + "%" }} />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </>
  );
}
export function Analytics() {
  return (
    <>
      <PageHead title="Analytics" sub={"Today so far · " + NOW} />
      <div className="kpis">
        <Stat icon={Users} n={H.apptsToday} l="Patients today" ctx="+8% vs last Sunday" />
        <Stat
          icon={Clock}
          n={H.avgWait + " min"}
          l="Average waiting time"
          ctx={H.waitDelta + " min shorter than last week"}
        />
        <Stat icon={Calendar} n={H.apptsDone + " / " + H.apptsToday} l="Appointments completed" />
        <Stat
          icon={BedDouble}
          n={H.bedsTotal - H.bedsFree + " / " + H.bedsTotal}
          l="Beds occupied"
          ctx={Math.round(((H.bedsTotal - H.bedsFree) / H.bedsTotal) * 100) + "%"}
        />
      </div>
      <div className="grid2">
        <Bar
          title="Patient flow (patients per hour)"
          unit="pts"
          items={[
            ["08:00", 14],
            ["09:00", 22],
            ["10:00", 32],
          ]}
        />
        <Bar
          pct
          title="Department utilization"
          unit="%"
          items={[
            ["Cardiology", 82],
            ["Neurology", 64],
            ["Orthopedics", 58],
            ["General Med.", 71],
            ["Emergency", 90],
          ]}
        />
      </div>
      <Bar
        title="Average waiting time by hour"
        unit="min"
        items={[
          ["08:00", 9],
          ["09:00", 14],
          ["10:00", 18],
        ]}
      />
    </>
  );
}
export function Account() {
  const { role, pick, toast } = useApp();
  const nav = useNavigate();
  const u = ROLE[role];
  const [pref, setPref] = useState({ email: true, sms: false });
  const p = role === "Patient" ? pt(ME_PID) : null;
  return (
    <>
      <PageHead title="My profile" sub="Your account details and preferences" />
      <div className="grid2">
        <section className="panel">
          <h2>Account</h2>
          <dl className="sum">
            <dt>Name</dt>
            <dd>{u.name}</dd>
            <dt>Role</dt>
            <dd>{role}</dd>
            <dt>Department</dt>
            <dd>{u.sub}</dd>
            <dt>Phone</dt>
            <dd>{u.phone}</dd>
            <dt>Email</dt>
            <dd>{u.email}</dd>
            {p && (
              <>
                <dt>Emergency contact</dt>
                <dd>
                  {p.ec.n} · {p.ec.rel} · {p.ec.ph}
                </dd>
              </>
            )}
          </dl>
        </section>
        <section className="panel">
          <h2>Preferences</h2>
          <label className="chk">
            <input
              type="checkbox"
              checked={pref.email}
              onChange={(e) => setPref({ ...pref, email: e.target.checked })}
            />{" "}
            Email reminders
          </label>
          <br />
          <label className="chk">
            <input type="checkbox" checked={pref.sms} onChange={(e) => setPref({ ...pref, sms: e.target.checked })} />{" "}
            SMS reminders
          </label>
          <p className="note">
            Text size and contrast are in <Link to="/settings">Accessibility</Link>.
          </p>
        </section>
      </div>
      <section className="panel soft">
        <h2>Demonstration controls</h2>
        <p className="note">For demonstration only. Real users see one role.</p>
        <div className="row">
          <label htmlFor="dr">Demo role</label>
          <select
            id="dr"
            style={{ maxWidth: 240 }}
            value={role}
            onChange={(e) => {
              pick(e.target.value);
              toast("Switched to " + e.target.value + " view.");
              nav("/dashboard");
            }}
          >
            {Object.keys(ROLE).map((r) => (
              <option key={r}>{r}</option>
            ))}
          </select>
        </div>
      </section>
    </>
  );
}
export function Settings() {
  const { a11y, setA, theme, setTheme } = useApp();
  return (
    <>
      <PageHead title="Accessibility" sub="Settings apply immediately and are kept on this device." />
      <section className="panel">
        <fieldset>
          <legend>Appearance</legend>
          <div className="radios" role="radiogroup" aria-label="Colour theme">
            {[
              ["system", "System default"],
              ["light", "Light"],
              ["dark", "Dark"],
            ].map(([v, l]) => (
              <label key={v}>
                <input type="radio" name="theme" value={v} checked={theme === v} onChange={() => setTheme(v)} />
                {l}
              </label>
            ))}
          </div>
          <p className="note">Your choice is saved on this device and overrides the system setting.</p>
        </fieldset>
        <div className="form">
          <label>
            Text size: {a11y.size}%
            <input
              type="range"
              min="90"
              max="150"
              step="10"
              value={a11y.size}
              onChange={(e) => setA({ ...a11y, size: +e.target.value })}
            />
          </label>
          <label className="chk">
            <input
              type="checkbox"
              checked={a11y.contrast}
              onChange={(e) => setA({ ...a11y, contrast: e.target.checked })}
            />{" "}
            High contrast
          </label>
          <label className="chk">
            <input
              type="checkbox"
              checked={a11y.reduceMotion}
              onChange={(e) => setA({ ...a11y, reduceMotion: e.target.checked })}
            />{" "}
            Reduce motion
          </label>
        </div>
      </section>
      <section className="panel soft">
        <h2>Keyboard navigation</h2>
        <ul className="feed">
          <li style={{ gridTemplateColumns: "90px 1fr" }}>
            <kbd>/</kbd>Jump to patient search
          </li>
          <li style={{ gridTemplateColumns: "90px 1fr" }}>
            <kbd>Tab</kbd>Move between controls; focus is always outlined
          </li>
          <li style={{ gridTemplateColumns: "90px 1fr" }}>
            <kbd>← →</kbd>Switch tabs on a patient record
          </li>
          <li style={{ gridTemplateColumns: "90px 1fr" }}>
            <kbd>Esc</kbd>Close notifications and dialogs
          </li>
        </ul>
      </section>
    </>
  );
}
