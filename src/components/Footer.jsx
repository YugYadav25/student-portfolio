import { useState, useEffect } from 'react';
import './Footer.css';

function Footer() {
  const [currentTime, setCurrentTime] = useState('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const timeString = now.toLocaleTimeString('en-GB', { hour12: false });
      setCurrentTime(timeString);
    };
    
    updateTime();
    const intervalId = setInterval(updateTime, 1000);
    return () => clearInterval(intervalId);
  }, []);

  return (
    <footer className="footer" id="footer">
      <div className="footer-container">
        <p className="copyright">
          © 2026 Student Portfolio. All rights reserved.
        </p>
        <div className="time-pill">
          {currentTime}
        </div>
      </div>
    </footer>
  );
}

export default Footer;
