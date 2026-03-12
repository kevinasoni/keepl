import React, { useRef, useState, useEffect } from 'react';
import './AiAdvisor.css';

const API_URL = process.env.REACT_APP_API_URL;

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
      // ✅ localhost replaced with env variable + auth token added
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
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h2>AI Financial Advisor</h2>
          <button
            onClick={handleClearChat}
            style={{ background: '#ef4444', color: 'white', border: 'none', borderRadius: '6px', padding: '6px 14px', cursor: 'pointer', fontWeight: 'bold' }}
          >
            Clear Chat
          </button>
        </div>

        <div className="messages">
          {messages.map((msg, idx) => (
            <div key={idx} className={`message ${msg.sender === 'user' ? 'user-msg' : 'ai-msg'}`}>
              {msg.text}
            </div>
          ))}
          {loading && (
            <div className="message ai-msg" style={{ color: '#888', fontStyle: 'italic' }}>
              Thinking...
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
            {loading ? '...' : 'Send'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default AiAdvisor;