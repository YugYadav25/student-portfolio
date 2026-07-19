import { useState } from 'react';
import './Contact.css';

function Contact() {
  const [message, setMessage] = useState('');
  const [showTooltip, setShowTooltip] = useState(false);

  const handleMessageChange = (e) => {
    setMessage(e.target.value);
  };

  const toggleTooltip = () => {
    setShowTooltip(!showTooltip);
  };

  return (
    <div className="contact-page section-container">
      <h1 className="section-title contact-title">Contact Me</h1>
      
      <div className="contact-form-container">
        <div className="contact-header">
          <span className="contact-prompt">Send me a message below.</span>
          <button 
            type="button" 
            className="need-help-btn" 
            onClick={toggleTooltip}
          >
            Need Help?
          </button>
        </div>
        
        {showTooltip && (
          <div className="help-tooltip">
            Please include your contact details so I can get back to you!
          </div>
        )}

        <div className="form-group">
          <textarea
            id="messageInput"
            value={message}
            onChange={handleMessageChange}
            rows="5"
            className="form-control"
          />
          <div className="character-count">
            Character count: {message.length}
          </div>
        </div>

        <button className="send-message-btn">Send Message</button>
      </div>
    </div>
  );
}

export default Contact;
