import { useMemo, useState } from 'react';
import useFetch from '../hooks/useFetch';
import Img from '../components/Img';
import { Loader, PageHero } from '../components/ui';
import { inr } from '../services/api';
const CATS = ['All', 'Tea Varieties', 'Special Chai', 'Cold Beverages', 'Snacks', 'Food Items'];
export default function Products() {
  const { data, loading, error } = useFetch('/products');
  const [cat, setCat] = useState('All');
  const [q, setQ] = useState('');
  const list = useMemo(() => (data || []).filter((p) => (cat === 'All' || p.category === cat) && (p.name + p.description).toLowerCase().includes(q.toLowerCase())), [data, cat, q]);
  return (
    <>
      <PageHero title="Products & Menu" sub="Teas, chai specials, cold beverages, snacks and more" />
      <section className="section"><div className="container">
        <div className="toolbar">
          <div className="chips">{CATS.map((c) => <button key={c} className={`chip ${cat === c ? 'active' : ''}`} onClick={() => setCat(c)}>{c}</button>)}</div>
          <input className="input search" placeholder="Search products…" value={q} onChange={(e) => setQ(e.target.value)} aria-label="Search products" />
        </div>
        {loading || error ? <Loader error={error} /> : (
          <div className="grid g4 mt">
            {list.map((p) => (
              <div className="card product" key={p._id}>
                <Img src={p.image} alt={p.name} />
                <div className="pad"><span className="badge">{p.category}</span><h3>{p.name}</h3><p>{p.description}</p>
                  <div className="row"><b className="price">{inr(p.price)}</b><span className={`badge ${p.available ? 'ok' : 'no'}`}>{p.available ? 'Available' : 'Out of stock'}</span></div></div>
              </div>
            ))}
            {!list.length && <p>No products match your search.</p>}
          </div>
        )}
      </div></section>
    </>
  );
}
