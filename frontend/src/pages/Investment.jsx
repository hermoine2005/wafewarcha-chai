import useFetch from '../hooks/useFetch';
import { Btn, Loader, PageHero, SampleBadge } from '../components/ui';
import { inr } from '../services/api';
export default function Investment() {
  const { data, loading, error } = useFetch('/investments');
  const total = (data || []).reduce((s, x) => s + x.amount, 0);
  return (
    <>
      <PageHero title="Investment Details" sub="Understand the investment needed to open a Wafewarcha Chai outlet" />
      <section className="section"><div className="container">
        <div className="center"><SampleBadge>Example figures - illustrative estimates only, not company-approved</SampleBadge></div>
        {loading || error ? <Loader error={error} /> : (
          <>
            <div className="grid g3 mt">
              {data.map((i) => <div className="card stat" key={i._id}><span className="eyebrow">{i.category}</span><h3>{i.title}</h3><div className="big">{inr(i.amount)}</div><small>{i.note}</small></div>)}
            </div>
            <div className="table-wrap mt"><table className="table">
              <thead><tr><th>Item</th><th>Category</th><th className="r">Amount (₹)</th></tr></thead>
              <tbody>{data.map((i) => <tr key={i._id}><td>{i.title}</td><td>{i.category}</td><td className="r">{inr(i.amount)}</td></tr>)}</tbody>
              <tfoot><tr><td colSpan="2">Estimated Total Investment</td><td className="r">{inr(total)}</td></tr></tfoot>
            </table></div>
          </>
        )}
        <div className="center mt"><Btn to="/operating-costs" variant="outline-dark">View Operating Costs</Btn></div>
      </div></section>
    </>
  );
}
