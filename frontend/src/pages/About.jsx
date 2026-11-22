import useFetch from '../hooks/useFetch';
import { Loader, PageHero, SectionTitle, SampleBadge } from '../components/ui';
export default function About() {
  const { data: b, loading, error } = useFetch('/brand');
  if (loading || error) return <Loader error={error} />;
  return (
    <>
      <PageHero title="About Wafewarcha Chai" sub={b.tagline} />
      <section className="section"><div className="container narrow">
        <SampleBadge>Editable sample content - managed from admin panel</SampleBadge>
        <h2 className="mt">Who we are</h2><p className="lead">{b.intro}</p>
        <h2>Our story</h2><p>{b.story}</p>
      </div></section>
      <section className="section alt"><div className="container grid g2">
        <div className="card"><h3>🎯 Our Mission</h3><p>{b.mission}</p></div>
        <div className="card"><h3>🔭 Our Vision</h3><p>{b.vision}</p></div>
      </div></section>
      <section className="section"><div className="container">
        <SectionTitle eyebrow="Brand Values" title="What we stand for" />
        <div className="grid g3">{(b.values || []).map((v, i) => <div className="card feature" key={i}><div className="icon">💎</div><h3>{v}</h3></div>)}</div>
      </div></section>
      <section className="section dark"><div className="container">
        <SectionTitle eyebrow="Why Choose Us" title="Why Wafewarcha Chai" />
        <ul className="ticks">{(b.whyChoose || []).map((v, i) => <li key={i}>{v}</li>)}</ul>
      </div></section>
    </>
  );
}
