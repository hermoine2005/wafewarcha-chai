import { Bar, BarChart, CartesianGrid, Cell, Legend, Line, LineChart, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import useFetch from '../../hooks/useFetch';
import { Loader } from '../../components/ui';
const COLORS = { Pending: '#d9902f', 'In Review': '#6b8fb5', Approved: '#4f9a62', Rejected: '#c0553f' };
export default function AdminDashboard() {
  const { data: d, loading, error } = useFetch('/admin/dashboard');
  if (loading || error) return <Loader error={error} />;
  const cards = [['Total Entrepreneurs', d.totalEntrepreneurs, '👥'], ['Total Enquiries', d.totalEnquiries, '📨'], ['Pending', d.pending, '⏳'], ['Approved', d.approved, '✅'], ['Rejected', d.rejected, '❌'], ['Total Products', d.totalProducts, '🍵'], ['Franchise Models', d.totalFranchiseModels, '🏪'], ['In Review', d.inReview, '🔍']];
  return (
    <div>
      <div className="page-head"><h2>Dashboard Overview</h2></div>
      <div className="grid g4">{cards.map(([l, v, i]) => <div className="card stat-card" key={l}><span className="icon">{i}</span><div><div className="big">{v}</div><small>{l}</small></div></div>)}</div>
      <div className="grid g2 mt">
        <div className="card"><h3>Enquiry Status</h3><div className="chart"><ResponsiveContainer>
          <PieChart><Pie data={d.statusChart} dataKey="value" nameKey="name" innerRadius={55} outerRadius={95} paddingAngle={2}>{d.statusChart.map((s) => <Cell key={s.name} fill={COLORS[s.name]} />)}</Pie><Tooltip /><Legend /></PieChart>
        </ResponsiveContainer></div></div>
        <div className="card"><h3>Enquiry Trend (6 months)</h3><div className="chart"><ResponsiveContainer>
          <BarChart data={d.trendChart}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="month" /><YAxis allowDecimals={false} /><Tooltip /><Bar dataKey="enquiries" fill="#d9902f" radius={[6, 6, 0, 0]} /></BarChart>
        </ResponsiveContainer></div></div>
      </div>
    </div>
  );
}
