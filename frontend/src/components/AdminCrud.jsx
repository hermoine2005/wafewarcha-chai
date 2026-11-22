import { useState } from 'react';
import useFetch from '../hooks/useFetch';
import api, { errMsg } from '../services/api';
import { Alert, Loader } from './ui';

const toForm = (fields, item) => Object.fromEntries(fields.map((f) => {
  const v = item?.[f.name];
  if (f.type === 'list') return [f.name, (v || []).join('\n')];
  if (f.type === 'checkbox') return [f.name, item ? !!v : f.default ?? true];
  return [f.name, v ?? f.default ?? ''];
}));
const toPayload = (fields, form) => Object.fromEntries(fields.map((f) => {
  const v = form[f.name];
  if (f.type === 'list') return [f.name, String(v).split('\n').map((s) => s.trim()).filter(Boolean)];
  if (f.type === 'number') return [f.name, v === '' ? undefined : Number(v)];
  return [f.name, v];
}));

export function Field({ f, value, onChange }) {
  const common = { className: 'input', value, onChange: (e) => onChange(f.type === 'checkbox' ? e.target.checked : e.target.value) };
  return (
    <label className={f.type === 'textarea' || f.type === 'list' ? 'full' : ''}>
      {f.label}{f.required ? ' *' : ''}
      {f.type === 'textarea' && <textarea rows="3" {...common} />}
      {f.type === 'list' && <textarea rows="4" placeholder="One item per line" {...common} />}
      {f.type === 'select' && <select {...common}>{f.options.map((o) => <option key={o}>{o}</option>)}</select>}
      {f.type === 'checkbox' && <input type="checkbox" checked={!!value} onChange={common.onChange} />}
      {['text', 'number', 'url', undefined].includes(f.type) && <input type={f.type === 'number' ? 'number' : 'text'} min={f.type === 'number' ? 0 : undefined} {...common} />}
    </label>
  );
}

export default function AdminCrud({ title, endpoint, fields, columns, hideAdd, hideEdit, note }) {
  const { data, loading, error, reload } = useFetch(endpoint);
  const [editing, setEditing] = useState(null); // null | 'new' | item
  const [form, setForm] = useState({});
  const [msg, setMsg] = useState({ type: '', text: '' });
  const [busy, setBusy] = useState(false);

  const open = (item) => { setEditing(item || 'new'); setForm(toForm(fields || [], item === 'new' ? null : item)); setMsg({ type: '', text: '' }); };
  const save = async (e) => {
    e.preventDefault(); setBusy(true); setMsg({ type: '', text: '' });
    try {
      const body = toPayload(fields, form);
      if (editing === 'new') await api.post(endpoint, body); else await api.put(`${endpoint}/${editing._id}`, body);
      setEditing(null); setMsg({ type: 'success', text: 'Saved successfully' }); reload();
    } catch (x) { setMsg({ type: 'error', text: errMsg(x) }); } finally { setBusy(false); }
  };
  const del = async (item) => {
    if (!window.confirm('Delete this record permanently?')) return;
    try { await api.delete(`${endpoint}/${item._id}`); setMsg({ type: 'success', text: 'Deleted successfully' }); reload(); }
    catch (x) { setMsg({ type: 'error', text: errMsg(x) }); }
  };

  return (
    <div>
      <div className="page-head"><h2>{title}</h2>{!hideAdd && <button className="btn primary sm" onClick={() => open()}>+ Add New</button>}</div>
      {note && <p className="muted">{note}</p>}
      <Alert type={msg.type}>{msg.text}</Alert>
      {loading || error ? <Loader error={error} /> : (
        <div className="card table-wrap"><table className="table">
          <thead><tr>{columns.map((c) => <th key={c.label}>{c.label}</th>)}<th className="r">Actions</th></tr></thead>
          <tbody>
            {data.map((row) => (
              <tr key={row._id}>{columns.map((c) => <td key={c.label}>{c.render ? c.render(row) : row[c.key]}</td>)}
                <td className="r actions">{!hideEdit && <button className="btn outline-dark sm" onClick={() => open(row)}>Edit</button>}<button className="btn danger sm" onClick={() => del(row)}>Delete</button></td></tr>
            ))}
            {!data.length && <tr><td colSpan={columns.length + 1}>No records found.</td></tr>}
          </tbody>
        </table></div>
      )}
      {editing && (
        <div className="modal-back" onClick={() => setEditing(null)}>
          <form className="modal form two" onClick={(e) => e.stopPropagation()} onSubmit={save}>
            <h3 className="full">{editing === 'new' ? 'Add' : 'Edit'} - {title.replace('Manage ', '')}</h3>
            <div className="full"><Alert type={msg.type}>{msg.text}</Alert></div>
            {fields.map((f) => <Field key={f.name} f={f} value={form[f.name]} onChange={(v) => setForm({ ...form, [f.name]: v })} />)}
            <div className="full actions"><button type="button" className="btn outline-dark" onClick={() => setEditing(null)}>Cancel</button><button className="btn primary" disabled={busy}>{busy ? 'Saving…' : 'Save'}</button></div>
          </form>
        </div>
      )}
    </div>
  );
}
