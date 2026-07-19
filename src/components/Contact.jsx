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
      <h1 className="section-title">Contact Me</h1>
      
      <div className="contact-form-container">
        <div className="form-group">
          <label htmlFor="messageInput">
            Your Message
            <button 
              type="button" 
              className="tooltip-toggle-btn" 
              onClick={toggleTooltip}
              aria-label="Toggle help tooltip"
            >
              ?
            </button>
          </label>
          
          {showTooltip && (
            <div className="help-tooltip">
              Please include your contact details so I can get back to you!
            </div>
          )}

          <textarea
            id="messageInput"
            value={message}
            onChange={handleMessageChange}
            placeholder="Type your message here..."
            rows="5"
            className="form-control"
          />
          <div className="character-count">
            {message.length} character{message.length !== 1 ? 's' : ''}
          </div>
        </div>

        <div className="message-preview">
          <h3>Live Preview</h3>
          <p className="preview-text">
            {message ? message : <em>Start typing to see preview...</em>}
          </p>
        </div>
      </div>
    </div>
  );
}

export default Contact;
