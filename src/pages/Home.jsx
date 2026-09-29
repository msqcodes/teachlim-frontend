import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AREAS, SUBJECTS } from "../constants";
import { qs } from "../api";
import founderImage from "../assets/founder.png";

const student = [
  ["Tell us what you need", "Post the subject, class, area and budget. It takes two minutes."],
  ["Tutors apply", "Tutors near you see your post and apply. You see who applied."],
  ["Take a free demo", "Meet the tutor, then confirm only if you like the class."],
];

const tutor = [
  ["Create your profile", "Add subjects, areas, experience and your fee."],
  ["Apply to tuitions", "Browse posts in your area and apply to the ones that fit."],
  ["Start teaching", "Parents contact you for a demo. Keep 100% of your fee."],
];

export default function Home() {
  const nav = useNavigate();
  const [kind, setKind] = useState("tutors");
  const [area, setArea] = useState("");
  const [subject, setSubject] = useState("");

  const go = (e) => {
    e.preventDefault();
    nav(`/${kind}?${qs({ area, subject })}`);
  };

  return (
    <>
      <section className="hero">
        <p className="badge">Open for Hyderabad Now</p>

        <h1>
          TEACHLIM
          <br />
          HOME TUTORS
        </h1>

        <p className="lead">
          Students and tutors find each other in the same neighbourhood.
          Post a tuition need or join as a tutor, both free.
        </p>

        <form className="search" onSubmit={go}>
          <div className="tabs">
            <button
              type="button"
              className={kind === "tutors" ? "on" : ""}
              onClick={() => setKind("tutors")}
            >
              Tutors
            </button>

            <button
              type="button"
              className={kind === "tuitions" ? "on" : ""}
              onClick={() => setKind("tuitions")}
            >
              Tuitions
            </button>
          </div>

          <select value={area} onChange={(e) => setArea(e.target.value)}>
            <option value="">All areas</option>
            {AREAS.map((a) => (
              <option key={a}>{a}</option>
            ))}
          </select>

          <select
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
          >
            <option value="">All subjects</option>
            {SUBJECTS.map((s) => (
              <option key={s}>{s}</option>
            ))}
          </select>

          <button className="btn">Search</button>
        </form>
      </section>

      <section className="split">
        <div className="panel">
          <h2>Need a tutor?</h2>
          <p>
            Post your requirement and get applications from tutors near you.
          </p>

          <Link className="btn" to="/post-tuition">
            Post a tuition need
          </Link>
        </div>

        <div className="panel dark">
          <h2>Want to teach?</h2>
          <p>
            Find students in your area and earn from your own schedule.
          </p>

          <Link className="btn light" to="/signup?role=tutor">
            Join as tutor
          </Link>
        </div>
      </section>

      <section className="section">
        <h2 className="h2">HOW IT WORKS</h2>

        <div className="cols2">
          {[
            ["For students and parents", student],
            ["For tutors", tutor],
          ].map(([t, steps]) => (
            <div key={t}>
              <h3>{t}</h3>

              <ol className="steps">
                {steps.map(([h, p]) => (
                  <li key={h}>
                    <b>{h}</b>
                    <span>{p}</span>
                  </li>
                ))}
              </ol>
            </div>
          ))}
        </div>
      </section>

      <section className="section">
        <h2 className="h2">WHY US</h2>

        <div className="cols3">
          <div>
            <h3>No commission</h3>
            <p>
              Tutors keep the full tuition fee. We never take a cut of monthly
              fees.
            </p>
          </div>

          <div>
            <h3>Hyderabad only</h3>
            <p>
              Every tutor and tuition is in the city, from Kukatpally to Uppal.
            </p>
          </div>

          <div>
            <h3>Free demo class</h3>
            <p>
              Try a class first. Confirm the tutor only when you are happy.
            </p>
          </div>
        </div>
      </section>

    <section className="founder-section">
  <div className="founder-container">

    <div className="founder-content">
      <p className="founder-label">THE FOUNDER</p>

      <h2>
        Building Teachlim
        <br />
        <span>with purpose.</span>
      </h2>

      <p className="founder-name">
        Shaik Sameer Anwar
      </p>

      <p className="founder-description">
        Founder of Teachlim, building a simpler way for
        students, parents and tutors to connect locally.
      </p>

      <p className="founder-quote">
        “The right tutor can make learning feel different.”
      </p>
    </div>

    <div className="founder-image-container">
      <img
        src={founderImage}
        alt="Shaik Sameer Anwar, Founder of Teachlim"
        className="founder-image"
      />
    </div>

  </div>
</section>
    </>
  );
}
