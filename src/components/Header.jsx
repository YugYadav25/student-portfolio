import './Header.css';

function Header({ name, title, email, socialLinks }) {
  return (
    <header className="header" id="header">
      <div className="hero-section" id="hero">
        <div className="hero-copy">
          <div className="hero-badge">Available for creative collaborations</div>
          <h1 className="hero-name">{name}<span>.</span></h1>
          <p className="hero-title">{title}</p>
          <p className="hero-intro">I design and build thoughtful digital products where clean interfaces meet reliable engineering.</p>
          <div className="hero-cta">
            <a href="#about" className="btn btn-primary">Explore my work <span>↘</span></a>
            <a href="/contact" className="btn btn-outline">Let&apos;s talk</a>
          </div>
          <div className="hero-meta">
            <a href={`mailto:${email}`} className="hero-email">{email}</a>
            <div className="hero-socials">
              {socialLinks.map((social) => (
                <a key={social.name} href={social.url} target="_blank" rel="noopener noreferrer" aria-label={social.name}>
                  {social.icon}
                </a>
              ))}
            </div>
          </div>
        </div>
        <div className="hero-card">
          <div className="hero-card-top"><span className="status-dot"></span> Currently learning</div>
          <div className="hero-card-title">Full-stack systems<br /><em>&amp; human interfaces</em></div>
          <div className="hero-card-grid">
            <span>01</span><strong>Build</strong><small>usable products</small>
            <span>02</span><strong>Learn</strong><small>every single day</small>
            <span>03</span><strong>Ship</strong><small>with intention</small>
          </div>
          <div className="hero-card-mark">YY</div>
        </div>
      </div>
    </header>
  );
}

export default Header;
