import { useState } from 'react';
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { errMsg } from '../services/api';
import { Alert } from '../components/ui';

function Shell({ title, sub, children, foot }) {
  return <section className="auth"><div className="card auth-card"><h2>{title}</h2><p className="muted">{sub}</p>{children}<div className="auth-foot">{foot}</div></div></section>;
}

export function Login() {
  const { login, user } = useAuth();
  const nav = useNavigate(); const loc = useLocation();
  const [f, setF] = useState({ email: '', password: '' });
  const [err, setErr] = useState(''); const [busy, setBusy] = useState(false);
  if (user) return <Navigate to={user.role === 'admin' ? '/admin' : '/dashboard'} replace />;
  const submit = async (e) => {
    e.preventDefault(); setErr('');
    if (!f.email || !f.password) return setErr('Email and password are required');
    setBusy(true);
    try { await login(f); nav(loc.state?.from || '/dashboard', { replace: true }); } catch (x) { setErr(errMsg(x)); } finally { setBusy(false); }
  };
  return (
    <Shell title="Entrepreneur Login" sub="Access your dashboard and enquiries" foot={<>New here? <Link to="/register">Create an account</Link></>}>
      <form className="form" onSubmit={submit} noValidate><Alert>{err}</Alert>
        <label>Email<input className="input" type="email" value={f.email} onChange={(e) => setF({ ...f, email: e.target.value })} /></label>
        <label>Password<input className="input" type="password" value={f.password} onChange={(e) => setF({ ...f, password: e.target.value })} /></label>
        <button className="btn primary" disabled={busy}>{busy ? 'Signing in…' : 'Login'}</button></form>
    </Shell>
  );
}

export function Register() {
  const { register, user } = useAuth();
  const nav = useNavigate();
  const [f, setF] = useState({ name: '', email: '', phone: '', password: '', confirmPassword: '' });
  const [err, setErr] = useState(''); const [busy, setBusy] = useState(false);
  if (user) return <Navigate to="/dashboard" replace />;
  const set = (k) => (e) => setF({ ...f, [k]: e.target.value });
  const validate = () => {
    if (f.name.trim().length < 2) return 'Full name must be at least 2 characters';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(f.email)) return 'Enter a valid email address';
    if (!/^[6-9]\d{9}$/.test(f.phone)) return 'Enter a valid 10-digit mobile number';
    if (f.password.length < 8 || !/[A-Za-z]/.test(f.password) || !/\d/.test(f.password)) return 'Password needs 8+ characters with letters and numbers';
    if (f.password !== f.confirmPassword) return 'Passwords do not match';
    return '';
  };
  const submit = async (e) => {
    e.preventDefault(); const v = validate(); if (v) return setErr(v);
    setBusy(true); setErr('');
    try { await register(f); nav('/dashboard', { replace: true }); } catch (x) { setErr(errMsg(x)); } finally { setBusy(false); }
  };
  return (
    <Shell title="Entrepreneur Registration" sub="Create an account to submit franchise enquiries" foot={<>Already registered? <Link to="/login">Login</Link></>}>
      <form className="form" onSubmit={submit} noValidate><Alert>{err}</Alert>
        <label>Full Name<input className="input" value={f.name} onChange={set('name')} /></label>
        <label>Email<input className="input" type="email" value={f.email} onChange={set('email')} /></label>
        <label>Phone Number<input className="input" inputMode="numeric" maxLength={10} value={f.phone} onChange={set('phone')} /></label>
        <label>Password<input className="input" type="password" value={f.password} onChange={set('password')} /></label>
        <label>Confirm Password<input className="input" type="password" value={f.confirmPassword} onChange={set('confirmPassword')} /></label>
        <button className="btn primary" disabled={busy}>{busy ? 'Creating…' : 'Register'}</button></form>
    </Shell>
  );
}

export function AdminLogin() {
  const { adminLogin, user } = useAuth();
  const nav = useNavigate();
  const [f, setF] = useState({ email: '', password: '' });
  const [err, setErr] = useState(''); const [busy, setBusy] = useState(false);
  if (user?.role === 'admin') return <Navigate to="/admin" replace />;
  const submit = async (e) => {
    e.preventDefault(); setErr(''); setBusy(true);
    try { await adminLogin(f); nav('/admin', { replace: true }); } catch (x) { setErr(errMsg(x)); } finally { setBusy(false); }
  };
  return (
    <Shell title="Admin Login" sub="Authorised administrators only" foot={<Link to="/">← Back to website</Link>}>
      <form className="form" onSubmit={submit} noValidate><Alert>{err}</Alert>
        <label>Admin Email<input className="input" type="email" value={f.email} onChange={(e) => setF({ ...f, email: e.target.value })} /></label>
        <label>Password<input className="input" type="password" value={f.password} onChange={(e) => setF({ ...f, password: e.target.value })} /></label>
        <button className="btn primary" disabled={busy}>{busy ? 'Signing in…' : 'Login to Admin'}</button></form>
    </Shell>
  );
}
