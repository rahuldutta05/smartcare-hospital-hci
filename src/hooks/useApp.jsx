import { createContext, useContext, useState, useEffect } from "react";
import { CheckCircle2 } from "lucide-react";
import { ROLE, NOW, notes as N0, appointments as A0, QUEUE } from "../data/data.js";
const C = createContext();
export const useApp = () => useContext(C);
export function AppProvider({ children }) {
  const [role, setRole] = useState(localStorage.getItem("sc-role") || "");
  const prefersReduced = typeof matchMedia === "function" && matchMedia("(prefers-reduced-motion: reduce)").matches;
  const saved = (() => {
    try {
      return JSON.parse(localStorage.getItem("sc-a11y")) || {};
    } catch {
      return {};
    }
  })();
  const [a11y, setA] = useState({ size: 100, contrast: false, reduceMotion: prefersReduced, ...saved });
  const [theme, setTheme] = useState(localStorage.getItem("sc-theme") || "system");
  const [appts, setAppts] = useState(A0);
  const [toasts, setT] = useState([]);
  const [dlg, setD] = useState(null);
  const [acks, setAcks] = useState({});
  const [qcur, setQ] = useState(QUEUE.start);
  const [ns, setNs] = useState(N0);
  useEffect(() => {
    localStorage.setItem("sc-a11y", JSON.stringify(a11y));
    const r = document.documentElement;
    r.style.fontSize = a11y.size + "%";
    r.classList.toggle("hc", a11y.contrast);
    r.classList.toggle("rm", a11y.reduceMotion);
  }, [a11y]);
  useEffect(() => {
    localStorage.setItem("sc-theme", theme);
    const mq = matchMedia("(prefers-color-scheme: dark)");
    const apply = () => {
      document.documentElement.dataset.theme =
        theme === "dark" || (theme === "system" && mq.matches) ? "dark" : "light";
    };
    apply();
    mq.addEventListener("change", apply);
    return () => mq.removeEventListener("change", apply);
  }, [theme]);
  useEffect(() => {
    if (!dlg) return;
    const onKey = (e) => e.key === "Escape" && setD(null);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [dlg]);
  const ack = (id) => setAcks((a) => ({ ...a, [id]: { by: ROLE[role]?.name || role, time: NOW } }));
  const pick = (r) => {
    setRole(r);
    localStorage.setItem("sc-role", r);
  };
  const toast = (msg, undo) => {
    const id = Math.random();
    setT((t) => [...t, { id, msg, undo }]);
    setTimeout(() => setT((t) => t.filter((x) => x.id !== id)), 6000);
  };
  return (
    <C.Provider
      value={{
        theme,
        setTheme,
        appts,
        setAppts,
        role,
        pick,
        a11y,
        setA,
        toast,
        ask: setD,
        acks,
        ack,
        qcur,
        setQ,
        ns,
        setNs,
      }}
    >
      {children}
      <div className="toasts" role="status" aria-live="polite">
        {toasts.map((t) => (
          <div key={t.id} className="toast">
            <CheckCircle2 size={18} />
            <span>{t.msg}</span>
            {t.undo && (
              <button
                onClick={() => {
                  t.undo();
                  setT((x) => x.filter((y) => y.id !== t.id));
                }}
              >
                Undo
              </button>
            )}
          </div>
        ))}
      </div>
      {dlg && (
        <div className="overlay">
          <div className="dlg" role="alertdialog" aria-modal="true" aria-labelledby="dt">
            <h2 id="dt">{dlg.title}</h2>
            <p>{dlg.body}</p>
            <div className="row end">
              <button className="btn ghost" autoFocus onClick={() => setD(null)}>
                Cancel
              </button>
              <button
                className={"btn " + (dlg.danger ? "danger" : "")}
                onClick={() => {
                  dlg.ok();
                  setD(null);
                }}
              >
                {dlg.label}
              </button>
            </div>
          </div>
        </div>
      )}
    </C.Provider>
  );
}
