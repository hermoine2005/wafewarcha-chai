import { useState } from 'react';
import useFetch from '../hooks/useFetch';
import api, { errMsg } from '../services/api';
import { Alert, PageHero, SampleBadge } from '../components/ui';
const empty = { name: '', email: '', phone: '', subject: '', message: '' };
export default function Contact() {
  const { data: b } = useFetch('/brand');
  const [f, setF] = useState(empty);
  const [msg, setMsg] = useState({ type: '', text: '' });
  const [busy, setBusy] = useState(false);
  const set = (k) => (e) => setF({ ...f, [k]: e.target.value });
  const validate = () => {
    if (f.name.trim().length < 2) return 'Please enter your name';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(f.email)) return 'Enter a valid email';
    if (!/^[6-9]\d{9}$/.test(f.phone)) return 'Enter a valid 10-digit mobile number';
    if (!f.subject.trim()) return 'Subject is required';
    if (f.message.trim().length < 10) return 'Message must be at least 10 characters';
    return '';
  };
  const submit = async (e) => {
    e.preventDefault();
    const v = validate(); if (v) return setMsg({ type: 'error', text: v });
    setBusy(true);
    try { const { data } = await api.post('/contact', f); setMsg({ type: 'success', text: data.message }); setF(empty); }
    catch (err) { setMsg({ type: 'error', text: errMsg(err) }); } finally { setBusy(false); }
  };
  return (
    <>
      <PageHero title="Contact Us" sub="We would love to hear from you" />
      <section className="section"><div className="container grid g2">
        <form className="card form" onSubmit={submit} noValidate>
          <h3>Send us a message</h3>
          <Alert type={msg.type}>{msg.text}</Alert>
          <label>Name<input className="input" value={f.name} onChange={set('name')} /></label>
          <label>Email<input className="input" type="email" value={f.email} onChange={set('email')} /></label>
          <label>Phone<input className="input" inputMode="numeric" maxLength={10} value={f.phone} onChange={set('phone')} /></label>
          <label>Subject<input className="input" value={f.subject} onChange={set('subject')} /></label>
          <label>Message<textarea className="input" rows="5" value={f.message} onChange={set('message')} /></label>
          <button className="btn primary" disabled={busy}>{busy ? 'Sending…' : 'Send Message'}</button>
        </form>
        <div>
          <div className="card"><h3>Contact details</h3><SampleBadge>Editable placeholders</SampleBadge>
            <p className="mt">📧 {b?.contactEmail}</p><p>📞 {b?.contactPhone}</p><p>📍 {b?.address}</p></div>
          <div className="card mt"><h3>Location</h3>
            {b?.mapEmbedUrl ? <iframe title="Location map" className="map" src={b.mapEmbedUrl} loading="lazy" /> : <div className="map placeholder">🗺️ Map placeholder - add an embed URL in Manage Brand Information</div>}
          </div>
        </div>
      </div></section>
    </>
  );
}
