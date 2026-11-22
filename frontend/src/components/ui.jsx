import { Link } from 'react-router-dom';
export const Loader = ({ error }) => <div className="state">{error ? <span className="err">{error}</span> : 'Loading…'}</div>;
export const SectionTitle = ({ eyebrow, title, sub }) => (
  <div className="section-title">{eyebrow && <span className="eyebrow">{eyebrow}</span>}<h2>{title}</h2>{sub && <p>{sub}</p>}</div>
);
export const PageHero = ({ title, sub }) => (
  <section className="page-hero"><div className="container"><h1>{title}</h1>{sub && <p>{sub}</p>}</div></section>
);
export const SampleBadge = ({ children = 'Sample / illustrative data' }) => <span className="badge sample">{children}</span>;
export const Alert = ({ type = 'error', children }) => children ? <div className={`alert ${type}`}>{children}</div> : null;
export const Btn = ({ to, variant = 'primary', ...p }) => to ? <Link to={to} className={`btn ${variant}`} {...p} /> : <button className={`btn ${variant}`} {...p} />;
