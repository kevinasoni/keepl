import React, { useRef, useState, useEffect } from 'react';
import './AiAdvisor.css';

function AiAdvisor() {
  // Load messages from localStorage or start with default message
  const [messages, setMessages] = useState(() => {
    const saved = localStorage.getItem('chatMessages');
    return saved ? JSON.parse(saved) : [{ sender: 'ai', text: "Hi! I'm your AI advisor. How can I help you today?" }];
  });
  const [userInput, setUserInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  // Save messages to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('chatMessages', JSON.stringify(messages));
  }, [messages]);

  // Scroll to bottom on new message
  useEffect(() => {
    if (messagesEndRef.current) messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async () => {
    if (!userInput.trim()) return;

    setMessages([...messages, { sender: 'user', text: userInput }]);
    setLoading(true);

    try {
      const response = await fetch('http://localhost:5000/api/ai-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userInput.trim() }),
      });

      const data = await response.json();
      if (response.ok) {
        setMessages(msgs => [...msgs, { sender: 'ai', text: data.response }]);
      } else {
        setMessages(msgs => [...msgs, { sender: 'ai', text: 'Sorry, I could not respond. Please try again later.' }]);
      }
    } catch (err) {
      setMessages(msgs => [...msgs, { sender: 'ai', text: 'Network error. Please try again.' }]);
    }

    setUserInput('');
    setLoading(false);
  };

  return (
    <div className="advisor-container">
      <div className="chat-box">
        <h2>AI Financial Advisor</h2>
        <div className="messages">
          {messages.map((msg, idx) => (
            <div
              key={idx}
              className={`message ${msg.sender === 'user' ? 'user-msg' : 'ai-msg'}`}
            >
              {msg.text}
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
        <div className="input-area">
          <input
            type="text"
            placeholder="Ask me anything..."
            value={userInput}
            onChange={e => setUserInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && !loading && handleSend()}
            disabled={loading}
          />
          <button
            onClick={handleSend}
            disabled={loading || !userInput.trim()}
          >
            {loading ? '...' : 'Send'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default AiAdvisor;
