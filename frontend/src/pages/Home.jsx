import { Link } from 'react-router-dom';
import useFetch from '../hooks/useFetch';
import Img from '../components/Img';
import { Btn, SectionTitle, SampleBadge } from '../components/ui';
import { inr } from '../services/api';

const HERO = 'https://images.unsplash.com/photo-1442512595331-e89e73853f31?auto=format&fit=crop&w=1800&q=80';
const testimonials = [
  ['Sample Testimonial', 'The process was clear and the support team guided me at every step.', 'Sample Entrepreneur A'],
  ['Sample Testimonial', 'A simple menu and a warm brand made our cafe popular quickly.', 'Sample Entrepreneur B'],
  ['Sample Testimonial', 'Transparent cost details helped me plan my budget with confidence.', 'Sample Entrepreneur C'],
];

export default function Home() {
  const { data: brand } = useFetch('/brand');
  const { data: models } = useFetch('/franchises');
  const { data: products } = useFetch('/products');
  const { data: steps } = useFetch('/process');
  return (
    <>
      <section className="hero" style={{ backgroundImage: `linear-gradient(rgba(40,22,10,.72),rgba(40,22,10,.78)), url(${HERO})` }}>
        <div className="container hero-inner">
          <span className="eyebrow light">Premium Indian Tea Franchise</span>
          <h1>Brew Your Business with <em>Wafewarcha Chai</em></h1>
          <p>{brand?.intro || 'A modern, professional tea cafe franchise built on authentic chai and entrepreneur success.'}</p>
          <div className="hero-btns"><Btn to="/franchise">Explore Franchise</Btn><Btn to="/products" variant="light">View Our Products</Btn></div>
        </div>
      </section>

      <section className="section"><div className="container">
        <SectionTitle eyebrow="Why Choose Us" title="A franchise built for your success" />
        <div className="grid g3">
          {(brand?.whyChoose || []).map((w, i) => <div className="card feature" key={i}><div className="icon">{['☕', '🤝', '📈', '🎓', '🏆', '✨'][i % 6]}</div><h3>{w}</h3></div>)}
        </div>
      </div></section>

      <section className="section alt"><div className="container">
        <SectionTitle eyebrow="Franchise Highlights" title="Choose the format that fits you" sub="Sample franchise models - official details will be provided by the company." />
        <div className="grid g3">
          {(models || []).slice(0, 3).map((m) => (
            <div className="card" key={m._id}><h3>{m.name}</h3><p>{m.description}</p><p className="meta">📐 {m.spaceRequired}</p><Link className="link" to="/franchise">Learn more →</Link></div>
          ))}
        </div>
      </div></section>

      <section className="section"><div className="container">
        <SectionTitle eyebrow="Popular Products" title="Crowd favourites" />
        <div className="grid g4">
          {(products || []).slice(0, 4).map((p) => (
            <div className="card product" key={p._id}><Img src={p.image} alt={p.name} /><div className="pad"><h3>{p.name}</h3><div className="row"><b className="price">{inr(p.price)}</b><span className="badge">{p.category}</span></div></div></div>
          ))}
        </div>
        <div className="center"><Btn to="/products" variant="outline-dark">See Full Menu</Btn></div>
      </div></section>

      <section className="section dark"><div className="container">
        <SectionTitle eyebrow="How to Start" title="Your franchise journey" />
        <div className="grid g3">
          {(steps || []).slice(0, 6).map((s) => <div className="step-card" key={s._id}><span className="num">{s.stepNumber}</span><h3>{s.title}</h3><p>{s.description}</p></div>)}
        </div>
        <div className="center"><Btn to="/process" variant="light">View Complete Process</Btn></div>
      </div></section>

      <section className="section"><div className="container">
        <SectionTitle eyebrow="Testimonials" title="What entrepreneurs say" />
        <div className="center"><SampleBadge>Sample content - not real customer reviews</SampleBadge></div>
        <div className="grid g3 mt">
          {testimonials.map(([t, q, n], i) => <div className="card quote" key={i}><p>“{q}”</p><b>{n}</b><small>{t}</small></div>)}
        </div>
      </div></section>

      <section className="section alt"><div className="container cta">
        <div><h2>Ready to start?</h2><p>{brand?.contactEmail} · {brand?.contactPhone}</p></div>
        <div className="hero-btns"><Btn to="/contact">Contact Us</Btn><Btn to="/register" variant="outline-dark">Register as Entrepreneur</Btn></div>
      </div></section>
    </>
  );
}
