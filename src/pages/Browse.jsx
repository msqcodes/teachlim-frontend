import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { api, qs } from "../api";
import { AREAS, CATEGORIES, SUBJECTS } from "../constants";
import { useAuth } from "../App.jsx";

export default function Browse({ kind }) {
  const { user } = useAuth();
  const [params, setParams] = useSearchParams();
  const f = { area: params.get("area") || "", subject: params.get("subject") || "", category: params.get("category") || "" };
  const [items, setItems] = useState(null);
  const [err, setErr] = useState("");
  const [msg, setMsg] = useState("");
  const isTutors = kind === "tutors";

  useEffect(() => {
    setItems(null); setErr("");
    api(`/${kind}?${qs(f)}`).then((d) => setItems(d[kind])).catch((e) => setErr(e.message));
  }, [kind, params]);

  const set = (k) => (e) => { const p = Object.fromEntries(params); e.target.value ? (p[k] = e.target.value) : delete p[k]; setParams(p); };
  const apply = async (id) => {
    try { await api(`/tuitions/${id}/apply`, { method: "POST" }); setMsg("Applied. The student can now see your profile."); }
    catch (e) { setMsg(e.message); }
  };

  return (
    <div className="page">
      <h1 className="h1">{isTutors ? "TUTORS IN HYDERABAD" : "TUITION JOBS IN HYDERABAD"}</h1>
      <div className="filters">
        <select value={f.area} onChange={set("area")}><option value="">All areas</option>{AREAS.map((a) => <option key={a}>{a}</option>)}</select>
        <select value={f.subject} onChange={set("subject")}><option value="">All subjects</option>{SUBJECTS.map((a) => <option key={a}>{a}</option>)}</select>
        <select value={f.category} onChange={set("category")}><option value="">All levels</option>{CATEGORIES.map((a) => <option key={a}>{a}</option>)}</select>
      </div>
      {msg && <p className="note">{msg}</p>}
      {err && <p className="error">{err}</p>}
      {!items && !err && <p>Loading…</p>}
      {items && items.length === 0 && (
        <div className="empty">
          <p>No results for these filters yet.</p>
          <Link className="btn" to={isTutors ? "/post-tuition" : "/signup?role=tutor"}>{isTutors ? "Post a tuition need" : "Join as tutor"}</Link>
        </div>
      )}
      <div className="grid">
        {items?.map((x) =>
          isTutors ? (
            <article className="card" key={x._id}>
              <h3>{x.user?.name}</h3>
              <p className="muted">{x.headline}</p>
              <p>{x.subjects?.join(", ")}</p>
              <p className="muted">{x.areas?.join(", ")}</p>
              <p className="meta"><span>{x.experienceYears} yrs</span><span>₹{x.feePerHour}/hr</span><span>{x.modes?.join(" + ")}</span></p>
              {user ? <p><b>{x.user?.phone}</b></p> : <Link className="link" to="/login">Log in to see contact</Link>}
            </article>
          ) : (
            <article className="card" key={x._id}>
              <h3>{x.subjects?.join(", ")}</h3>
              <p className="muted">{x.category} · {x.area}</p>
              <p>{x.description}</p>
              <p className="meta"><span>₹{x.budget}/month</span><span>{x.daysPerWeek} days/week</span><span>{x.mode}</span></p>
              {user?.role === "tutor" ? <button className="btn small" onClick={() => apply(x._id)}>Apply</button>
                : !user ? <Link className="link" to="/signup?role=tutor">Join as tutor to apply</Link> : null}
            </article>
          )
        )}
      </div>
    </div>
  );
}
