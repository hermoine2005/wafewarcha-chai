import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api, { errMsg, inr } from '../services/api';
import { useAuth } from '../context/AuthContext';
import useFetch from '../hooks/useFetch';
import { Alert } from '../components/ui';

const STATES = ['Andhra Pradesh', 'Assam', 'Bihar', 'Chhattisgarh', 'Delhi', 'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka', 'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Odisha', 'Punjab', 'Rajasthan', 'Tamil Nadu', 'Telangana', 'Uttar Pradesh', 'Uttarakhand', 'West Bengal', 'Other'];

function EnquiryForm({ user, onDone }) {
  const { data: models } = useFetch('/franchises');
  const [f, setF] = useState({ fullName: user.name, email: user.email, phone: user.phone, city: '', state: '', preferredModel: '', budget: '', preferredLocation: '', message: '' });
  const [err, setErr] = useState(''); const [ok, setOk] = useState(null); const [busy, setBusy] = useState(false);
  const set = (k) => (e) => setF({ ...f, [k]: e.target.value });
  const submit = async (e) => {
    e.preventDefault(); setErr(''); setOk(null);
    if (f.fullName.trim().length < 2) return setErr('Full name is required');
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(f.email)) return setErr('Enter a valid email');
    if (!/^[6-9]\d{9}$/.test(f.phone)) return setErr('Enter a valid 10-digit phone');
    for (const k of ['city', 'state', 'preferredModel', 'preferredLocation']) if (!f[k].trim()) return setErr('Please fill all required fields');
    if (!(Number(f.budget) > 0)) return setErr('Enter a valid estimated budget');
    setBusy(true);
    try { const { data } = await api.post('/enquiries', f); setOk(data); setF({ ...f, city: '', state: '', preferredModel: '', budget: '', preferredLocation: '', message: '' }); onDone(); }
    catch (x) { setErr(errMsg(x)); } finally { setBusy(false); }
  };
  return (
    <form className="card form two" onSubmit={submit} noValidate>
      <h3 className="full">Submit Franchise Enquiry</h3>
      <div className="full"><Alert>{err}</Alert>
        {ok && <Alert type="success">Enquiry submitted successfully! Your reference number is <b>{ok.referenceNo}</b>. Status: {ok.status}.</Alert>}</div>
      <label>Full Name *<input className="input" value={f.fullName} onChange={set('fullName')} /></label>
      <label>Email *<input className="input" type="email" value={f.email} onChange={set('email')} /></label>
      <label>Phone Number *<input className="input" maxLength={10} value={f.phone} onChange={set('phone')} /></label>
      <label>City *<input className="input" value={f.city} onChange={set('city')} /></label>
      <label>State *<select className="input" value={f.state} onChange={set('state')}><option value="">Select state</option>{STATES.map((s) => <option key={s}>{s}</option>)}</select></label>
      <label>Preferred Franchise Model *<select className="input" value={f.preferredModel} onChange={set('preferredModel')}><option value="">Select model</option>{(models || []).map((m) => <option key={m._id}>{m.name}</option>)}</select></label>
      <label>Estimated Budget (₹) *<input className="input" type="number" min="0" value={f.budget} onChange={set('budget')} /></label>
      <label>Preferred Location *<input className="input" value={f.preferredLocation} onChange={set('preferredLocation')} /></label>
      <label className="full">Additional Message<textarea className="input" rows="4" maxLength={1000} value={f.message} onChange={set('message')} /></label>
      <button className="btn primary full" disabled={busy}>{busy ? 'Submitting…' : 'Submit Enquiry'}</button>
    </form>
  );
}

const Status = ({ s }) => <span className={`status ${s.replace(' ', '').toLowerCase()}`}>{s}</span>;

function MyEnquiries({ data, loading, error }) {
  return (
    <div className="card">
      <h3>My Enquiries</h3>
      {loading ? <p>Loading…</p> : error ? <Alert>{error}</Alert> : !data.length ? <p>You have not submitted any enquiries yet.</p> : (
        <div className="table-wrap"><table className="table">
          <thead><tr><th>Reference No.</th><th>Model</th><th>Location</th><th>Budget</th><th>Submitted</th><th>Status</th></tr></thead>
          <tbody>{data.map((e) => <tr key={e._id}><td><b>{e.referenceNo}</b></td><td>{e.preferredModel}</td><td>{e.preferredLocation}, {e.city}</td><td>{inr(e.budget)}</td><td>{new Date(e.createdAt).toLocaleDateString('en-IN')}</td><td><Status s={e.status} /></td></tr>)}</tbody>
        </table></div>
      )}
    </div>
  );
}

export default function Dashboard() {
  const { user } = useAuth();
  const [tab, setTab] = useState('home');
  const enq = useFetch('/enquiries/mine');
  useEffect(() => { if (tab === 'enquiries') enq.reload(); /* refresh to show latest admin status */ }, [tab]); // eslint-disable-line
  const tabs = [['home', 'Overview'], ['enquire', 'Submit Enquiry'], ['enquiries', 'My Enquiries']];
  return (
    <section className="section"><div className="container">
      <div className="welcome"><div><h2>Welcome, {user.name}! 👋</h2><p>Manage your franchise journey with Wafewarcha Chai.</p></div></div>
      <div className="chips mt">{tabs.map(([k, l]) => <button key={k} className={`chip ${tab === k ? 'active' : ''}`} onClick={() => setTab(k)}>{l}{k === 'enquiries' && enq.data ? ` (${enq.data.length})` : ''}</button>)}</div>
      <div className="mt">
        {tab === 'home' && (
          <div className="grid g2">
            <div className="card"><h3>Profile Details</h3><p><b>Name:</b> {user.name}</p><p><b>Email:</b> {user.email}</p><p><b>Phone:</b> {user.phone}</p><p><b>Member since:</b> {new Date(user.createdAt).toLocaleDateString('en-IN')}</p></div>
            <div className="card"><h3>Quick Actions</h3>
              <div className="quick"><Link className="btn outline-dark" to="/franchise">Browse Franchise Opportunities</Link><Link className="btn outline-dark" to="/investment">View Investment Details</Link><Link className="btn outline-dark" to="/products">View Products</Link>
                <button className="btn primary" onClick={() => setTab('enquire')}>Submit Franchise Enquiry</button><button className="btn outline-dark" onClick={() => setTab('enquiries')}>My Enquiries</button></div></div>
          </div>
        )}
        {tab === 'enquire' && <EnquiryForm user={user} onDone={enq.reload} />}
        {tab === 'enquiries' && <MyEnquiries {...enq} />}
      </div>
    </div></section>
  );
}
