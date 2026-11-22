import { useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
const items = [['/admin', 'Dashboard', '📊'], ['/admin/brand', 'Manage Brand Information', '🏷️'], ['/admin/franchises', 'Manage Franchise Models', '🏪'], ['/admin/investments', 'Manage Investment Details', '💰'], ['/admin/costs', 'Manage Operating Costs', '🧾'], ['/admin/products', 'Manage Products', '🍵'], ['/admin/process', 'Manage Franchise Process', '🪜'], ['/admin/gallery', 'Manage Gallery', '🖼️'], ['/admin/users', 'Registered Entrepreneurs', '👥'], ['/admin/enquiries', 'Franchise Enquiries', '📨'], ['/admin/messages', 'Contact Messages', '✉️']];
export default function AdminLayout() {
  const [open, setOpen] = useState(false);
  const { user, logout } = useAuth();
  const nav = useNavigate();
  return (
    <div className="admin-shell">
      <aside className={`sidebar ${open ? 'open' : ''}`}>
        <div className="logo light side-logo">☕ Wafewarcha <b>Chai</b><small>Admin Panel</small></div>
        {items.map(([to, l, i]) => <NavLink key={to} to={to} end={to === '/admin'} onClick={() => setOpen(false)}><span>{i}</span>{l}</NavLink>)}
        <button className="logout" onClick={() => { logout(); nav('/admin/login'); }}>🚪 Logout</button>
      </aside>
      <div className="admin-main">
        <div className="admin-top"><button className="burger dark" onClick={() => setOpen(!open)}>☰</button><span>Signed in as <b>{user?.name}</b></span></div>
        <div className="admin-content"><Outlet /></div>
      </div>
    </div>
  );
}
