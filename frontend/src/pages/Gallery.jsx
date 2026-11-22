import { useState } from 'react';
import useFetch from '../hooks/useFetch';
import Img from '../components/Img';
import { Loader, PageHero } from '../components/ui';
const CATS = ['All', 'Cafe Interiors', 'Tea Preparation', 'Products', 'Franchise'];
export default function Gallery() {
  const { data, loading, error } = useFetch('/gallery');
  const [cat, setCat] = useState('All');
  const [open, setOpen] = useState(null);
  const list = (data || []).filter((g) => cat === 'All' || g.category === cat);
  return (
    <>
      <PageHero title="Gallery" sub="Cafe interiors, tea preparation, products and franchise moments" />
      <section className="section"><div className="container">
        <div className="chips center">{CATS.map((c) => <button key={c} className={`chip ${cat === c ? 'active' : ''}`} onClick={() => setCat(c)}>{c}</button>)}</div>
        {loading || error ? <Loader error={error} /> : (
          <div className="grid g3 mt gallery">
            {list.map((g) => <button className="g-item" key={g._id} onClick={() => setOpen(g)}><Img src={g.imageUrl} alt={g.title} /><span>{g.title}</span></button>)}
          </div>
        )}
      </div></section>
      {open && <div className="modal-back" onClick={() => setOpen(null)}><div className="lightbox" onClick={(e) => e.stopPropagation()}><Img src={open.imageUrl} alt={open.title} /><p>{open.title}</p><button className="btn primary sm" onClick={() => setOpen(null)}>Close</button></div></div>}
    </>
  );
}
