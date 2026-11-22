import { Link } from 'react-router-dom';
import useFetch from '../hooks/useFetch';
export default function Footer() {
  const { data: b } = useFetch('/brand');
  return (
    <footer className="footer">
      <div className="container footer-grid">
        <div><div className="logo light">☕ Wafewarcha <b>Chai</b></div><p>{b?.tagline || 'Brew Your Business with Wafewarcha Chai'}</p></div>
        <div><h4>Explore</h4><Link to="/franchise">Franchise Models</Link><Link to="/investment">Investment</Link><Link to="/products">Menu</Link><Link to="/process">Franchise Process</Link></div>
        <div><h4>Company</h4><Link to="/about">About Us</Link><Link to="/gallery">Gallery</Link><Link to="/contact">Contact</Link><Link to="/admin/login">Admin Login</Link></div>
        <div><h4>Contact</h4><p>{b?.contactEmail}</p><p>{b?.contactPhone}</p><p>{b?.address}</p></div>
      </div>
      <div className="footer-bottom">© {new Date().getFullYear()} Wafewarcha Chai. Demo project - all figures and contact details are sample placeholders.</div>
    </footer>
  );
}
