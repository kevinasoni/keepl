import React, { useRef, useState, useEffect } from 'react';
import './AiAdvisor.css';

const API_URL = process.env.REACT_APP_API_URL;

// Converts AI markdown-style text into readable HTML
const formatText = (text) => {
  const lines = text.split('\n');
  const result = [];
  let i = 0;

  while (i < lines.length) {
    const line = lines[i].trim();

    if (!line) { i++; continue; }

    // Headings: ### or **Title**
    if (/^###\s+/.test(line)) {
      result.push(`<h4>${inline(line.replace(/^###\s+/, ''))}</h4>`);
    } else if (/^##\s+/.test(line)) {
      result.push(`<h3>${inline(line.replace(/^##\s+/, ''))}</h3>`);
    } else if (/^#\s+/.test(line)) {
      result.push(`<h2>${inline(line.replace(/^#\s+/, ''))}</h2>`);
    }
    // Bullet points
    else if (/^[-•*]\s+/.test(line)) {
      const items = [];
      while (i < lines.length && /^[-•*]\s+/.test(lines[i].trim())) {
        items.push(`<li>${inline(lines[i].trim().replace(/^[-•*]\s+/, ''))}</li>`);
        i++;
      }
      result.push(`<ul>${items.join('')}</ul>`);
      continue;
    }
    // Numbered lists
    else if (/^\d+\.\s+/.test(line)) {
      const items = [];
      while (i < lines.length && /^\d+\.\s+/.test(lines[i].trim())) {
        items.push(`<li>${inline(lines[i].trim().replace(/^\d+\.\s+/, ''))}</li>`);
        i++;
      }
      result.push(`<ol>${items.join('')}</ol>`);
      continue;
    }
    // Regular paragraph
    else {
      result.push(`<p>${inline(line)}</p>`);
    }

    i++;
  }

  return result.join('');
};

// Handles inline formatting: **bold**, *italic*, `code`
const inline = (text) => {
  return text
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.+?)\*/g, '<em>$1</em>')
    .replace(/`(.+?)`/g, '<code>$1</code>');
};

function AiAdvisor() {
  const [messages, setMessages] = useState(() => {
    const saved = localStorage.getItem('chatMessages');
    return saved ? JSON.parse(saved) : [{ sender: 'ai', text: "Hi! I'm your AI advisor. How can I help you today?" }];
  });
  const [userInput, setUserInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    localStorage.setItem('chatMessages', JSON.stringify(messages));
  }, [messages]);

  useEffect(() => {
    if (messagesEndRef.current) messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async () => {
    if (!userInput.trim()) return;
    const token = localStorage.getItem('authToken');
    setMessages(prev => [...prev, { sender: 'user', text: userInput }]);
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/api/ai-chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ message: userInput.trim() }),
      });
      const data = await response.json();
      if (response.ok) {
        setMessages(msgs => [...msgs, { sender: 'ai', text: data.response }]);
      } else {
        setMessages(msgs => [...msgs, { sender: 'ai', text: data.error || 'Sorry, I could not respond. Please try again.' }]);
      }
    } catch (err) {
      setMessages(msgs => [...msgs, { sender: 'ai', text: 'Network error. Please try again.' }]);
    }
    setUserInput('');
    setLoading(false);
  };

  const handleClearChat = () => {
    const initial = [{ sender: 'ai', text: "Hi! I'm your AI advisor. How can I help you today?" }];
    setMessages(initial);
    localStorage.setItem('chatMessages', JSON.stringify(initial));
  };

  return (
    <div className="advisor-container">
      <div className="chat-box">
        <div className="chat-header">
          <div className="chat-header-left">
            <div className="ai-avatar">🤖</div>
            <div>
              <h2>AI Financial Advisor</h2>
              <span className="ai-status">● Online</span>
            </div>
          </div>
          <button className="clear-btn" onClick={handleClearChat}>
            Clear Chat
          </button>
        </div>

        <div className="messages">
          {messages.map((msg, idx) => (
            <div key={idx} className={`message-row ${msg.sender === 'user' ? 'user-row' : 'ai-row'}`}>
              {msg.sender === 'ai' && <div className="msg-avatar">🤖</div>}
              <div className={`message ${msg.sender === 'user' ? 'user-msg' : 'ai-msg'}`}>
                {msg.sender === 'ai'
                  ? <div dangerouslySetInnerHTML={{ __html: formatText(msg.text) }} />
                  : msg.text
                }
              </div>
              {msg.sender === 'user' && <div className="msg-avatar user-avatar">👤</div>}
            </div>
          ))}

          {loading && (
            <div className="message-row ai-row">
              <div className="msg-avatar">🤖</div>
              <div className="message ai-msg thinking">
                <span></span><span></span><span></span>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        <div className="input-area">
          <input
            type="text"
            placeholder="Ask me anything about finance, legacy planning..."
            value={userInput}
            onChange={e => setUserInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && !loading && handleSend()}
            disabled={loading}
          />
          <button onClick={handleSend} disabled={loading || !userInput.trim()}>
            {loading ? '...' : '➤ Send'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default AiAdvisor;
