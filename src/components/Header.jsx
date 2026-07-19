import './Header.css';

function Header({ name, title }) {
  return (
    <header className="header" id="header">
      <div className="hero-section" id="hero">
        <div className="hero-badge">👋 Welcome to my portfolio</div>
        <h1 className="hero-name">{name}</h1>
        <p className="hero-title">{title}</p>
        <div className="hero-cta">
          <a href="#about" className="btn btn-primary">Learn More</a>
          <a href="/contact" className="btn btn-outline">Get in Touch</a>
        </div>
        <div className="hero-glow"></div>
      </div>
    </header>
  );
}

export default Header;
