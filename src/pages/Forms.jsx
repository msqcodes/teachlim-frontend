import { useEffect, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { api } from "../api";
import { AREAS, CATEGORIES, SUBJECTS, MODES } from "../constants";
import { useAuth } from "../App.jsx";

function Chips({ options, value, onChange }) {
  return (
    <div className="chips">
      {options.map((o) => (
        <button type="button" key={o} className={"chip" + (value.includes(o) ? " on" : "")}
          onClick={() => onChange(value.includes(o) ? value.filter((v) => v !== o) : [...value, o])}>{o}</button>
      ))}
    </div>
  );
}
const Field = ({ label, children }) => <label className="field"><span>{label}</span>{children}</label>;

function useForm(initial) {
  const [v, setV] = useState(initial);
  const [err, setErr] = useState("");
  const [busy, setBusy] = useState(false);
  const bind = (k) => ({ value: v[k] ?? "", onChange: (e) => setV({ ...v, [k]: e.target.value }) });
  return { v, setV, err, setErr, busy, setBusy, bind };
}

export function Login() {
  const { login } = useAuth(); const nav = useNavigate();
  const f = useForm({ email: "", password: "" });
  const submit = async (e) => {
    e.preventDefault(); f.setBusy(true); f.setErr("");
    try { login(await api("/auth/login", { method: "POST", body: f.v })); nav("/dashboard"); }
    catch (x) { f.setErr(x.message); } finally { f.setBusy(false); }
  };
  return (
    <form className="form" onSubmit={submit}>
      <h1>Log in</h1>
      <Field label="Email"><input type="email" required {...f.bind("email")} /></Field>
      <Field label="Password"><input type="password" required {...f.bind("password")} /></Field>
      {f.err && <p className="error">{f.err}</p>}
      <button className="btn" disabled={f.busy}>{f.busy ? "Logging in…" : "Log in"}</button>
      <p className="muted">New here? <Link to="/signup">Create an account</Link></p>
    </form>
  );
}

export function Signup() {
  const { login } = useAuth(); const nav = useNavigate();
  const [p] = useSearchParams();
  const f = useForm({ name: "", email: "", phone: "", password: "", role: p.get("role") === "tutor" ? "tutor" : "student" });
  const submit = async (e) => {
    e.preventDefault(); f.setBusy(true); f.setErr("");
    try {
      const d = await api("/auth/register", { method: "POST", body: f.v });
      login(d); nav(d.user.role === "tutor" ? "/tutor-profile" : "/post-tuition");
    } catch (x) { f.setErr(x.message); } finally { f.setBusy(false); }
  };
  return (
    <form className="form" onSubmit={submit}>
      <h1>Create your account</h1>
      <div className="tabs">
        {["student", "tutor"].map((r) => (
          <button type="button" key={r} className={f.v.role === r ? "on" : ""} onClick={() => f.setV({ ...f.v, role: r })}>
            {r === "student" ? "I need a tutor" : "I am a tutor"}
          </button>
        ))}
      </div>
      <Field label="Full name"><input required {...f.bind("name")} /></Field>
      <Field label="Email"><input type="email" required {...f.bind("email")} /></Field>
      <Field label="Mobile number"><input required pattern="[6-9][0-9]{9}" title="10-digit Indian mobile number" {...f.bind("phone")} /></Field>
      <Field label="Password (min 6 characters)"><input type="password" minLength={6} required {...f.bind("password")} /></Field>
      {f.err && <p className="error">{f.err}</p>}
      <button className="btn" disabled={f.busy}>{f.busy ? "Creating…" : "Create account"}</button>
      <p className="muted">Already registered? <Link to="/login">Log in</Link></p>
    </form>
  );
}

export function PostTuition() {
  const { user } = useAuth(); const nav = useNavigate();
  const f = useForm({ subjects: [], category: CATEGORIES[2], area: "", mode: "Home", budget: "", daysPerWeek: "5", description: "" });
  if (!user) return <div className="form"><h1>Post a tuition need</h1><p>Create a free account first so tutors can reach you.</p><Link className="btn" to="/signup">Create account</Link></div>;
  if (user.role !== "student") return <p className="pad">Only student accounts can post tuition needs.</p>;
  const submit = async (e) => {
    e.preventDefault();
    if (!f.v.subjects.length) return f.setErr("Pick at least one subject.");
    f.setBusy(true); f.setErr("");
    try { await api("/tuitions", { method: "POST", body: f.v }); nav("/dashboard"); }
    catch (x) { f.setErr(x.message); } finally { f.setBusy(false); }
  };
  return (
    <form className="form wide" onSubmit={submit}>
      <h1>Post a tuition need</h1>
      <Field label="Subjects"><Chips options={SUBJECTS} value={f.v.subjects} onChange={(s) => f.setV({ ...f.v, subjects: s })} /></Field>
      <Field label="Class or level"><select {...f.bind("category")}>{CATEGORIES.map((c) => <option key={c}>{c}</option>)}</select></Field>
      <Field label="Area in Hyderabad"><select required {...f.bind("area")}><option value="">Select area</option>{AREAS.map((a) => <option key={a}>{a}</option>)}</select></Field>
      <Field label="Mode"><select {...f.bind("mode")}>{MODES.map((m) => <option key={m}>{m}</option>)}</select></Field>
      <Field label="Budget per month (₹)"><input type="number" min="0" required {...f.bind("budget")} /></Field>
      <Field label="Days per week"><input type="number" min="1" max="7" required {...f.bind("daysPerWeek")} /></Field>
      <Field label="Details (board, timing, gender preference)"><textarea rows="4" {...f.bind("description")} /></Field>
      {f.err && <p className="error">{f.err}</p>}
      <button className="btn" disabled={f.busy}>{f.busy ? "Posting…" : "Post tuition need"}</button>
    </form>
  );
}

export function TutorProfile() {
  const nav = useNavigate();
  const f = useForm({ headline: "", qualification: "", experienceYears: "0", feePerHour: "", subjects: [], categories: [], areas: [], modes: ["Home"], bio: "" });
  useEffect(() => { api("/tutors/me").then((d) => d.profile && f.setV({ ...f.v, ...d.profile })).catch(() => {}); }, []);
  const submit = async (e) => {
    e.preventDefault();
    if (!f.v.subjects.length || !f.v.areas.length) return f.setErr("Pick at least one subject and one area.");
    f.setBusy(true); f.setErr("");
    try { await api("/tutors/me", { method: "PUT", body: f.v }); nav("/dashboard"); }
    catch (x) { f.setErr(x.message); } finally { f.setBusy(false); }
  };
  const set = (k) => (val) => f.setV({ ...f.v, [k]: val });
  return (
    <form className="form wide" onSubmit={submit}>
      <h1>Your tutor profile</h1>
      <Field label="Headline (e.g. Maths teacher with 5 years of experience)"><input required {...f.bind("headline")} /></Field>
      <Field label="Qualification"><input required {...f.bind("qualification")} /></Field>
      <Field label="Experience (years)"><input type="number" min="0" {...f.bind("experienceYears")} /></Field>
      <Field label="Fee per hour (₹)"><input type="number" min="0" required {...f.bind("feePerHour")} /></Field>
      <Field label="Subjects you teach"><Chips options={SUBJECTS} value={f.v.subjects} onChange={set("subjects")} /></Field>
      <Field label="Levels"><Chips options={CATEGORIES} value={f.v.categories} onChange={set("categories")} /></Field>
      <Field label="Areas you can travel to"><Chips options={AREAS} value={f.v.areas} onChange={set("areas")} /></Field>
      <Field label="Modes"><Chips options={MODES} value={f.v.modes} onChange={set("modes")} /></Field>
      <Field label="About you"><textarea rows="4" {...f.bind("bio")} /></Field>
      {f.err && <p className="error">{f.err}</p>}
      <button className="btn" disabled={f.busy}>{f.busy ? "Saving…" : "Save profile"}</button>
    </form>
  );
}
