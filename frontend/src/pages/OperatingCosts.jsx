import useFetch from '../hooks/useFetch';
import { Loader, PageHero, SampleBadge } from '../components/ui';
import { inr } from '../services/api';
export default function OperatingCosts() {
  const { data, loading, error } = useFetch('/costs');
  const total = (data || []).reduce((s, x) => s + x.monthlyAmount, 0);
  return (
    <>
      <PageHero title="Operating Costs" sub="Typical monthly expenses of running an outlet" />
      <section className="section"><div className="container narrow">
        <div className="center"><SampleBadge>Illustrative monthly estimates</SampleBadge></div>
        {loading || error ? <Loader error={error} /> : (
          <div className="table-wrap mt"><table className="table">
            <thead><tr><th>Expense</th><th>Notes</th><th className="r">Monthly (₹)</th></tr></thead>
            <tbody>{data.map((c) => <tr key={c._id}><td>{c.item}</td><td>{c.note}</td><td className="r">{inr(c.monthlyAmount)}</td></tr>)}</tbody>
            <tfoot><tr><td colSpan="2">Estimated Total Monthly Cost</td><td className="r">{inr(total)}</td></tr></tfoot>
          </table></div>
        )}
      </div></section>
    </>
  );
}
