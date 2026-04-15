import { Link } from 'react-router-dom';
import '../styles/globals.css';

export default function NotFound() {
  return (
    <div className="notfound-page">
      <div className="notfound-bg">
        <div className="bg-orb orb-1" />
        <div className="bg-orb orb-2" />
      </div>
      <div className="notfound-content">
        <div className="notfound-code">
          <span className="four">4</span>
          <div className="zero-container">
            <div className="zero-ring" />
            <span className="zero">0</span>
          </div>
          <span className="four">4</span>
        </div>
        <h1>Page Not Found</h1>
        <p>The page you're looking for doesn't exist or has been moved.</p>
        <div className="notfound-links">
          <Link to="/dashboard" className="nf-link primary">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" /><polyline points="9 22 9 12 15 12 15 22" /></svg>
            Go to Dashboard
          </Link>
          <Link to="/auth" className="nf-link secondary">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M15 3h4a2 2 0 012 2v14a2 2 0 01-2 2h-4" /><polyline points="10 17 15 12 10 7" /><line x1="15" y1="12" x2="3" y2="12" /></svg>
            Sign In
          </Link>
        </div>
      </div>
    </div>
  );
}
