import useFetch from '../hooks/useFetch';
import { Btn, Loader, PageHero, SampleBadge } from '../components/ui';
import { useAuth } from '../context/AuthContext';
const List = ({ title, items }) => items?.length ? <div><h4>{title}</h4><ul>{items.map((x, i) => <li key={i}>{x}</li>)}</ul></div> : null;
export default function Franchise() {
  const { data, loading, error } = useFetch('/franchises');
  const { user } = useAuth();
  return (
    <>
      <PageHero title="Franchise Opportunities" sub="Explore the available franchise models" />
      <section className="section"><div className="container">
        <div className="center"><SampleBadge>Sample / demo models - official details to be supplied</SampleBadge></div>
        {loading || error ? <Loader error={error} /> : (
          <div className="grid g3 mt">
            {data.map((m) => (
              <article className="card franchise" key={m._id}>
                <h3>{m.name}</h3><p>{m.description}</p>
                <p className="meta">📐 Space required: <b>{m.spaceRequired}</b></p>
                <List title="Features" items={m.features} /><List title="Benefits" items={m.benefits} /><List title="Eligibility" items={m.eligibility} />
              </article>
            ))}
            {!data.length && <p>No franchise models available yet.</p>}
          </div>
        )}
        <div className="center mt"><Btn to={user?.role === 'entrepreneur' ? '/dashboard' : '/register'}>Apply for Franchise</Btn></div>
      </div></section>
    </>
  );
}
