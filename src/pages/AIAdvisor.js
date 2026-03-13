import React, { useRef, useState, useEffect } from 'react';
import './AiAdvisor.css';

function AiAdvisor() {
  const [messages, setMessages] = useState(() => {
    const saved = localStorage.getItem('chatMessages');
    return saved ? JSON.parse(saved) : [
      { sender: 'ai', text: "Hi! I'm your AI advisor powered by Claude. How can I help you with legacy planning, finance, or anything else today?" }
    ];
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
    if (!userInput.trim() || loading) return;

    const userMessage = userInput.trim();
    setMessages(prev => [...prev, { sender: 'user', text: userMessage }]);
    setUserInput('');
    setLoading(true);

    try {
      // Build conversation history for context (last 10 messages)
      const history = messages.slice(-10).map(msg => ({
        role: msg.sender === 'user' ? 'user' : 'assistant',
        content: msg.text
      }));

      const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': process.env.REACT_APP_ANTHROPIC_KEY,
          'anthropic-version': '2023-06-01',
          'anthropic-dangerous-direct-browser-access': 'true'
        },
        body: JSON.stringify({
          model: 'claude-sonnet-4-20250514',
          max_tokens: 1024,
          system: `You are a helpful AI advisor for KeepLegacy, a legacy management platform. 
You specialize in helping users with:
- Legacy and estate planning
- Financial planning (investments, savings, insurance)
- Medical and health planning
- Document organization and management
- Family and beneficiary planning
- Tax planning and CIBIL scores
Keep responses concise, warm, and practical. You are speaking with someone who wants to organize their life and legacy for their loved ones.`,
          messages: [
            ...history,
            { role: 'user', content: userMessage }
          ]
        })
      });

      const data = await response.json();

      if (response.ok && data.content?.[0]?.text) {
        setMessages(prev => [...prev, { sender: 'ai', text: data.content[0].text }]);
      } else {
        const errMsg = data.error?.message || 'Sorry, I could not respond. Please try again.';
        setMessages(prev => [...prev, { sender: 'ai', text: errMsg }]);
      }
    } catch (err) {
      setMessages(prev => [...prev, { sender: 'ai', text: 'Network error. Please check your connection and try again.' }]);
    }

    setLoading(false);
  };

  const handleClearChat = () => {
    const initial = [{ sender: 'ai', text: "Hi! I'm your AI advisor powered by Claude. How can I help you with legacy planning, finance, or anything else today?" }];
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