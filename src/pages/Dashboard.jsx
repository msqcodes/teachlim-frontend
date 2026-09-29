import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../api";
import { useAuth } from "../App.jsx";

export default function Dashboard() {
  const { user } = useAuth();
  const isTutor = user.role === "tutor";
  const [items, setItems] = useState(null);
  const [err, setErr] = useState("");
  useEffect(() => {
    api(isTutor ? "/applications/mine" : "/tuitions/mine").then((d) => setItems(d.items)).catch((e) => setErr(e.message));
  }, [isTutor]);

  return (
    <div className="page">
      <h1 className="h1">HELLO, {user.name.split(" ")[0].toUpperCase()}</h1>
      {err && <p className="error">{err}</p>}
      {isTutor ? (
        <>
          <p><Link className="btn small" to="/tutor-profile">Edit profile</Link> <Link className="btn small ghost" to="/tuitions">Find tuitions</Link></p>
          <h2>Your applications</h2>
          {items?.length === 0 && <p className="empty">You have not applied yet. <Link to="/tuitions">Browse tuition jobs</Link>.</p>}
          <div className="grid">
            {items?.map((a) => (
              <article className="card" key={a._id}>
                <h3>{a.tuition?.subjects?.join(", ")}</h3>
                <p className="muted">{a.tuition?.category} · {a.tuition?.area}</p>
                <p className="meta"><span>₹{a.tuition?.budget}/month</span><span>{a.status}</span></p>
                {a.status === "accepted" && <p><b>Contact: {a.tuition?.student?.name}, {a.tuition?.student?.phone}</b></p>}
              </article>
            ))}
          </div>
        </>
      ) : (
        <>
          <p><Link className="btn small" to="/post-tuition">Post another need</Link> <Link className="btn small ghost" to="/tutors">Browse tutors</Link></p>
          <h2>Your tuition posts</h2>
          {items?.length === 0 && <p className="empty">Nothing posted yet. <Link to="/post-tuition">Post your first tuition need</Link>.</p>}
          <div className="grid">
            {items?.map((t) => (
              <article className="card" key={t._id}>
                <h3>{t.subjects?.join(", ")}</h3>
                <p className="muted">{t.category} · {t.area} · ₹{t.budget}/month</p>
                <h4>{t.applicants?.length || 0} applicant(s)</h4>
                {t.applicants?.map((a) => (
                  <div className="applicant" key={a._id}>
                    <b>{a.tutor?.name}</b> <span className="muted">{a.tutor?.phone}</span>
                    <span className="muted"> · {a.status}</span>
                  </div>
                ))}
              </article>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
