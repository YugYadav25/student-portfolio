import { Link } from 'react-router-dom';
import './NavBar.css';

function NavBar({ isDarkMode, toggleTheme }) {
  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="navbar-logo">
          <Link to="/" className="nav-logo-link">
            <span className="logo-icon">◈</span>
            <span className="logo-text">Portfolio</span>
          </Link>
        </div>
        <div className="navbar-links">
          <Link to="/" className="nav-link">Home</Link>
          <Link to="/projects" className="nav-link">Projects</Link>
          <Link to="/contact" className="nav-link">Contact</Link>
          <button className="theme-toggle-btn" onClick={toggleTheme}>
            {isDarkMode ? '☀️ Light' : '🌙 Dark'}
          </button>
        </div>
      </div>
    </nav>
  );
}

export default NavBar;
