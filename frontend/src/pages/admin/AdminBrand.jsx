import { useEffect, useState } from 'react';
import useFetch from '../../hooks/useFetch';
import api, { errMsg } from '../../services/api';
import { Alert, Loader } from '../../components/ui';
import { Field } from '../../components/AdminCrud';

const fields = [
  { name: 'name', label: 'Brand Name', type: 'text' }, { name: 'tagline', label: 'Tagline', type: 'text' },
  { name: 'intro', label: 'Brand Introduction', type: 'textarea' }, { name: 'story', label: 'Our Story', type: 'textarea' },
  { name: 'mission', label: 'Mission', type: 'textarea' }, { name: 'vision', label: 'Vision', type: 'textarea' },
  { name: 'values', label: 'Brand Values', type: 'list' }, { name: 'whyChoose', label: 'Why Choose Us', type: 'list' },
  { name: 'contactEmail', label: 'Contact Email (placeholder)', type: 'text' }, { name: 'contactPhone', label: 'Contact Phone (placeholder)', type: 'text' },
  { name: 'address', label: 'Address (placeholder)', type: 'text' }, { name: 'mapEmbedUrl', label: 'Google Maps Embed URL (optional)', type: 'text' },
];

export default function AdminBrand() {
  const { data, loading, error } = useFetch('/brand');
  const [form, setForm] = useState({});
  const [msg, setMsg] = useState({ type: '', text: '' });
  useEffect(() => {
    if (data) setForm(Object.fromEntries(fields.map((f) => [f.name, f.type === 'list' ? (data[f.name] || []).join('\n') : data[f.name] || ''])));
  }, [data]);
  if (loading || error) return <Loader error={error} />;
  const save = async (e) => {
    e.preventDefault();
    const body = Object.fromEntries(fields.map((f) => [f.name, f.type === 'list' ? form[f.name].split('\n').map((s) => s.trim()).filter(Boolean) : form[f.name]]));
    try { await api.put('/brand', body); setMsg({ type: 'success', text: 'Brand information saved' }); } catch (x) { setMsg({ type: 'error', text: errMsg(x) }); }
  };
  return (
    <div><div className="page-head"><h2>Manage Brand Information</h2></div>
      <form className="card form two" onSubmit={save}>
        <div className="full"><Alert type={msg.type}>{msg.text}</Alert></div>
        {fields.map((f) => <Field key={f.name} f={f} value={form[f.name] ?? ''} onChange={(v) => setForm({ ...form, [f.name]: v })} />)}
        <button className="btn primary full">Save Changes</button>
      </form></div>
  );
}
