import { createContext, useContext, useEffect, useState } from "react";
import { Link, NavLink, Navigate, Route, Routes, useNavigate } from "react-router-dom";
import { api } from "./api";
import Home from "./pages/Home.jsx";
import Browse from "./pages/Browse.jsx";
import { Login, Signup, PostTuition, TutorProfile } from "./pages/Forms.jsx";
import Dashboard from "./pages/Dashboard.jsx";

const AuthCtx = createContext(null);
export const useAuth = () => useContext(AuthCtx);

function Nav() {
  const { user, logout } = useAuth();
  const [open, setOpen] = useState(false);
  const close = () => setOpen(false);
  return (
    <header className="nav">
      <Link to="/" className="logo" onClick={close}>Teachlim</Link>
      <button className="burger" aria-label="Menu" onClick={() => setOpen(!open)}>Menu</button>
      <nav className={open ? "open" : ""} onClick={close}>
        <NavLink to="/tutors">Find tutors</NavLink>
        <NavLink to="/tuitions">Tuition jobs</NavLink>
        {(!user || user.role === "student") && <NavLink to="/post-tuition">Post a need</NavLink>}
        {user ? (
          <>
            <NavLink to="/dashboard">Dashboard</NavLink>
            <button className="link" onClick={logout}>Log out</button>
          </>
        ) : (
          <>
            <NavLink to="/login">Log in</NavLink>
            <Link to="/signup?role=tutor" className="btn small">Join as tutor</Link>
          </>
        )}
      </nav>
    </header>
  );
}

function Footer() {
  return (
    <footer className="footer">
      <h2>Let's find the right tutor, right in your neighbourhood.</h2>
      <div className="row">
        <div><Link to="/post-tuition">Post a tuition need</Link><Link to="/signup?role=tutor">Join as tutor</Link></div>
        <div><Link to="/tutors">Browse tutors</Link><Link to="/tuitions">Browse tuition jobs</Link></div>
        <p>Serving Hyderabad only, for now.<br />© {new Date().getFullYear()} Teachlim </p>
      </div>
    </footer>
  );
}

export function Protected({ role, children }) {
  const { user, loading } = useAuth();
  if (loading) return <p className="pad">Loading…</p>;
  if (!user) return <Navigate to="/login" replace />;
  if (role && user.role !== role) return <Navigate to="/dashboard" replace />;
  return children;
}

export default function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(!!localStorage.getItem("token"));
  const nav = useNavigate();

  useEffect(() => {
    if (!localStorage.getItem("token")) return;
    api("/auth/me").then((d) => setUser(d.user)).catch(() => localStorage.removeItem("token")).finally(() => setLoading(false));
  }, []);

  const login = ({ token, user }) => { localStorage.setItem("token", token); setUser(user); };
  const logout = () => { localStorage.removeItem("token"); setUser(null); nav("/"); };

  return (
    <AuthCtx.Provider value={{ user, loading, login, logout }}>
      <Nav />
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/tutors" element={<Browse kind="tutors" />} />
          <Route path="/tuitions" element={<Browse kind="tuitions" />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/post-tuition" element={<PostTuition />} />
          <Route path="/tutor-profile" element={<Protected role="tutor"><TutorProfile /></Protected>} />
          <Route path="/dashboard" element={<Protected><Dashboard /></Protected>} />
          <Route path="*" element={<p className="pad">Page not found.</p>} />
        </Routes>
      </main>
      <Footer />
    </AuthCtx.Provider>
  );
}
