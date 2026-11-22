import { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
const links = [['/', 'Home'], ['/about', 'About'], ['/franchise', 'Franchise'], ['/investment', 'Investment'], ['/operating-costs', 'Costs'], ['/products', 'Menu'], ['/process', 'Process'], ['/gallery', 'Gallery'], ['/contact', 'Contact']];
export default function Navbar() {
  const [open, setOpen] = useState(false);
  const { user, logout } = useAuth();
  const nav = useNavigate();
  const close = () => setOpen(false);
  return (
    <header className="navbar">
      <div className="container nav-inner">
        <Link to="/" className="logo" onClick={close}><span>☕</span> Wafewarcha <b>Chai</b></Link>
        <button className="burger" aria-label="Toggle menu" onClick={() => setOpen(!open)}>{open ? '✕' : '☰'}</button>
        <nav className={`nav-links ${open ? 'open' : ''}`}>
          {links.map(([to, l]) => <NavLink key={to} to={to} end={to === '/'} onClick={close}>{l}</NavLink>)}
          {user ? (
            <>
              <NavLink to={user.role === 'admin' ? '/admin' : '/dashboard'} onClick={close}>{user.role === 'admin' ? 'Admin Panel' : 'My Dashboard'}</NavLink>
              <button className="btn outline sm" onClick={() => { logout(); close(); nav('/'); }}>Logout</button>
            </>
          ) : (
            <><Link to="/login" className="btn outline sm" onClick={close}>Login</Link><Link to="/register" className="btn primary sm" onClick={close}>Register</Link></>
          )}
        </nav>
      </div>
    </header>
  );
}
