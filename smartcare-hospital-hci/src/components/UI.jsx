import { Link } from "react-router-dom";
import { AlertTriangle, Inbox } from "lucide-react";
import { ALERTS, H } from "../data/data.js";
const TONE = {
  Stable: "ok",
  Completed: "ok",
  Administered: "ok",
  Paid: "ok",
  "On duty": "ok",
  Available: "ok",
  "Report Ready": "ok",
  Confirmed: "info",
  Upcoming: "info",
  Scheduled: "info",
  "In Consultation": "info",
  "Ready for review": "info",
  Waiting: "warn",
  Attention: "warn",
  "Under Observation": "warn",
  Processing: "warn",
  Delayed: "warn",
  Pending: "warn",
  High: "warn",
  Normal: "ok",
  Due: "warn",
  "On break": "warn",
  Critical: "crit",
  Emergency: "crit",
  Missed: "crit",
  Cancelled: "mute",
  Discharged: "mute",
  Empty: "mute",
  "Off shift": "mute",
};
const G = { ok: "✔", info: "ℹ", warn: "▲", crit: "⚠", mute: "○" };
export const Badge = ({ s }) => {
  const t = TONE[s] || "mute";
  return (
    <span className={"badge " + t}>
      <span aria-hidden="true">{G[t]}</span>
      {s === "Empty" ? "Vacant" : s}
    </span>
  );
};
export const Avatar = ({ name, lg }) => (
  <span className={"av" + (lg ? " lg" : "")} aria-hidden="true">
    {((w) =>
      w.length > 1
        ? w
            .map((x) => x[0])
            .slice(0, 2)
            .join("")
        : w[0].slice(0, 2).toUpperCase())(name.replace(/^(Dr\.|Nurse)\s/, "").split(" "))}
  </span>
);
export const PageHead = ({ title, sub, children }) => (
  <div className="pagehead">
    <div>
      <h1>{title}</h1>
      {sub && <p className="sub">{sub}</p>}
    </div>
    {children}
  </div>
);
export const Stat = ({ n, l, tone, icon: I, ctx }) => (
  <div className={"stat " + (tone || "")}>
    <span className="sl">
      {l}
      {tone && <i className="sdot" aria-hidden="true" />}
    </span>
    <strong>{n}</strong>
    {ctx && <small>{ctx}</small>}
  </div>
);
export const Bar = ({ title, unit, items, pct }) => {
  const m = pct ? 100 : Math.max(...items.map((i) => i[1]));
  return (
    <section className="panel">
      <h2>{title}</h2>
      {items.map(([l, v]) => (
        <div className="bar" key={l}>
          <span>{l}</span>
          <div role="progressbar" aria-valuenow={v} aria-valuemin="0" aria-valuemax={m} aria-label={l + " " + v + unit}>
            <i className={pct && v >= 90 ? "hi" : ""} style={{ width: (v / m) * 100 + "%" }} />
          </div>
          <b>
            {v}
            {unit === "%" ? "%" : " " + unit}
          </b>
        </div>
      ))}
    </section>
  );
};
export const Empty = ({ t, sub, icon: I = Inbox, action }) => (
  <div className="empty">
    <I size={28} aria-hidden="true" />
    <p>
      <b>{t}</b>
    </p>
    {sub && <p>{sub}</p>}
    {action}
  </div>
);
export const Skel = ({ rows = 4 }) => (
  <div role="status" aria-label="Loading">
    <span className="sr">Loading…</span>
    {Array.from({ length: rows }, (_, i) => (
      <div key={i} className="sk" style={{ width: 70 + ((i * 7) % 30) + "%" }} />
    ))}
  </div>
);
export function Emergency({ p, ack, onAck }) {
  const alert = p && ALERTS.find((a) => a.pid === p.id);
  const critical = ALERTS.filter((a) => a.sev === "Critical").length;
  const icu = H.occupancy.find((o) => o[0] === "ICU")[1];
  return (
    <div className="emerg" role="alert">
      <h2>
        <AlertTriangle size={16} aria-hidden="true" /> EMERGENCY ALERT
      </h2>
      {p ? (
        <>
          <p className="sev">CRITICAL</p>
          <p className="big">
            {p.name} · {p.bed}
          </p>
          <div className="metric">
            <span className="mlabel">SpO₂</span>
            <span className="spo">{p.vitals.SpO2.replace(" ", "")}</span>
            <span className="trend">↓ Critical</span>
          </div>
          <p>{p.conditions.join(" · ")}</p>
          <p className="mut">Last recorded {alert.last}</p>
          {ack ? (
            <p className="ackd">
              ✔ Alert acknowledged by {ack.by} · {ack.time}. Condition is still critical.
            </p>
          ) : null}
          <div className="row">
            {!ack && <b style={{ alignSelf: "center" }}>Immediate attention required</b>}
            <Link className="btn" to={"/patients/" + p.id}>
              View patient
            </Link>
            {!ack && (
              <button className="btn ghost" onClick={onAck}>
                Acknowledge
              </button>
            )}
          </div>
        </>
      ) : (
        <>
          <p className="big">
            {critical} critical patient{critical === 1 ? "" : "s"}
          </p>
          <p className="mut">
            ICU: {icu}% occupied · {H.emergencyBedsFree} emergency beds available
          </p>
          <div className="row">
            <Link className="btn danger sm" to="/alerts">
              View emergency queue
            </Link>
          </div>
        </>
      )}
    </div>
  );
}
