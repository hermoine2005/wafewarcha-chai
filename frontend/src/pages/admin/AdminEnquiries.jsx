import { useEffect, useState } from 'react';
import api, { errMsg, inr } from '../../services/api';
import { Alert, Loader } from '../../components/ui';
const STATUSES = ['Pending', 'In Review', 'Approved', 'Rejected'];
export default function AdminEnquiries() {
  const [list, setList] = useState(null);
  const [q, setQ] = useState(''); const [status, setStatus] = useState('');
  const [err, setErr] = useState(''); const [msg, setMsg] = useState('');
  const [sel, setSel] = useState(null); const [edit, setEdit] = useState({ status: '', adminNote: '' });

  useEffect(() => {
    const t = setTimeout(() => {
      api.get('/enquiries', { params: { q, status } }).then((r) => { setList(r.data); setErr(''); }).catch((e) => setErr(errMsg(e)));
    }, 250); // debounce the server-side search
    return () => clearTimeout(t);
  }, [q, status, msg]);

  const open = (e) => { setSel(e); setEdit({ status: e.status, adminNote: e.adminNote || '' }); setMsg(''); };
  const save = async () => {
    try { const { data } = await api.put(`/enquiries/${sel._id}`, edit); setSel(null); setMsg('Enquiry updated - the entrepreneur can now see the new status.'); }
    catch (x) { setErr(errMsg(x)); }
  };
  const del = async () => {
    if (!window.confirm('Delete this enquiry permanently?')) return;
    try { await api.delete(`/enquiries/${sel._id}`); setSel(null); setMsg('Enquiry deleted'); } catch (x) { setErr(errMsg(x)); }
  };
  return (
    <div>
      <div className="page-head"><h2>Franchise Enquiries</h2></div>
      <div className="toolbar"><input className="input search" placeholder="Search by reference, name, email, city…" value={q} onChange={(e) => setQ(e.target.value)} />
        <select className="input" style={{ maxWidth: 200 }} value={status} onChange={(e) => setStatus(e.target.value)}><option value="">All statuses</option>{STATUSES.map((s) => <option key={s}>{s}</option>)}</select></div>
      <Alert>{err}</Alert><Alert type="success">{msg}</Alert>
      {!list ? <Loader /> : (
        <div className="card table-wrap mt"><table className="table">
          <thead><tr><th>Reference</th><th>Name</th><th>Model</th><th>City</th><th>Budget</th><th>Date</th><th>Status</th><th className="r">Action</th></tr></thead>
          <tbody>{list.map((e) => <tr key={e._id}><td><b>{e.referenceNo}</b></td><td>{e.fullName}</td><td>{e.preferredModel}</td><td>{e.city}</td><td>{inr(e.budget)}</td><td>{new Date(e.createdAt).toLocaleDateString('en-IN')}</td>
            <td><span className={`status ${e.status.replace(' ', '').toLowerCase()}`}>{e.status}</span></td><td className="r"><button className="btn outline-dark sm" onClick={() => open(e)}>View / Update</button></td></tr>)}
            {!list.length && <tr><td colSpan="8">No enquiries found.</td></tr>}</tbody>
        </table></div>
      )}
      {sel && (
        <div className="modal-back" onClick={() => setSel(null)}><div className="modal" onClick={(e) => e.stopPropagation()}>
          <h3>Enquiry {sel.referenceNo}</h3>
          <div className="details">
            {[['Name', sel.fullName], ['Email', sel.email], ['Phone', sel.phone], ['City', sel.city], ['State', sel.state], ['Preferred Model', sel.preferredModel], ['Budget', inr(sel.budget)], ['Preferred Location', sel.preferredLocation], ['Account', sel.user ? `${sel.user.name} (${sel.user.email})` : '—'], ['Submitted', new Date(sel.createdAt).toLocaleString('en-IN')]].map(([k, v]) => <p key={k}><span>{k}</span>{v}</p>)}
            <p className="wide"><span>Message</span>{sel.message || '—'}</p>
          </div>
          <div className="form">
            <label>Status<select className="input" value={edit.status} onChange={(e) => setEdit({ ...edit, status: e.target.value })}>{STATUSES.map((s) => <option key={s}>{s}</option>)}</select></label>
            <label>Internal Admin Note (not visible to entrepreneur)<textarea className="input" rows="3" maxLength={1000} value={edit.adminNote} onChange={(e) => setEdit({ ...edit, adminNote: e.target.value })} /></label>
            <div className="actions"><button className="btn danger" onClick={del}>Delete</button><button className="btn outline-dark" onClick={() => setSel(null)}>Close</button><button className="btn primary" onClick={save}>Save Changes</button></div>
          </div>
        </div></div>
      )}
    </div>
  );
}
