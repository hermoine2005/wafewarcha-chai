import useFetch from '../hooks/useFetch';
import { Btn, Loader, PageHero } from '../components/ui';
export default function Process() {
  const { data, loading, error } = useFetch('/process');
  return (
    <>
      <PageHero title="Franchise Process" sub="From first enquiry to your grand opening" />
      <section className="section"><div className="container narrow">
        {loading || error ? <Loader error={error} /> : (
          <ol className="timeline">{data.map((s) => <li key={s._id}><span className="num">{s.stepNumber}</span><div className="card"><h3>{s.title}</h3><p>{s.description}</p></div></li>)}</ol>
        )}
        <div className="center mt"><Btn to="/register">Start Your Enquiry</Btn></div>
      </div></section>
    </>
  );
}
