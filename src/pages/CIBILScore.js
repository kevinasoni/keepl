import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import BackButton from '../components/BackButton';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const API_URL = process.env.REACT_APP_API_URL;

const Container = styled.div`max-width: 600px; margin: auto; background: #fff; padding: 2rem; border-radius: 8px; box-shadow: 0 0 10px rgba(0,0,0,0.1);`;
const Title = styled.h1`margin-bottom: 1.5rem;`;
const Label = styled.label`display: block; margin-top: 1rem; font-weight: bold;`;
const Input = styled.input`width: 100%; padding: 0.6rem; border-radius: 4px; border: 1px solid #ccc; margin-top: 0.5rem;`;
const Button = styled.button`
  margin-top: 1.5rem; background-color: ${p => p.danger ? '#ef4444' : '#2990fc'}; color: white;
  padding: 0.8rem 1.5rem; border: none; border-radius: 6px; cursor: pointer; margin-right: 0.5rem; font-weight: bold;
  &:hover { opacity: 0.9; } &:disabled { opacity: 0.5; cursor: not-allowed; }
`;
const Card = styled.div`border: 1px solid #e2e8f0; padding: 1rem; border-radius: 10px; margin-top: 1rem; background: #f9fbff; p { margin: 4px 0; }`;

const ScoreBadge = styled.div`
  font-size: 3rem; font-weight: bold; text-align: center; padding: 1rem;
  color: ${p => p.score >= 750 ? '#22c55e' : p.score >= 600 ? '#f59e0b' : '#ef4444'};
`;

const emptyForm = { score: '', lastChecked: '' };

const CIBILScore = () => {
  const [data, setData] = useState(null);
  const [formData, setFormData] = useState(emptyForm);
  const [showForm, setShowForm] = useState(true);
  const [loading, setLoading] = useState(false);

  const token = localStorage.getItem('authToken');
  const authHeaders = { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` };

  useEffect(() => { fetchData(); }, []);

  const fetchData = async () => {
    try {
      const res = await fetch(`${API_URL}/api/user-data`, { headers: authHeaders });
      const d = await res.json();
      if (res.ok && d.data?.cibilScore) { setData(d.data.cibilScore); setFormData(d.data.cibilScore); setShowForm(false); }
    } catch (err) { console.error('Failed to load'); }
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); setLoading(true);
    const res = await fetch(`${API_URL}/api/user-data`, {
      method: 'POST', headers: authHeaders,
      body: JSON.stringify({ cibilScore: formData }),
    });
    if (res.ok) {
      toast.success('CIBIL Score saved!');
      setData(formData); setShowForm(false);
    } else toast.error('Failed to save');
    setLoading(false);
  };

  const getScoreLabel = (score) => {
    if (score >= 750) return '🟢 Excellent';
    if (score >= 700) return '🟡 Good';
    if (score >= 600) return '🟠 Fair';
    return '🔴 Poor';
  };

  return (
    <Container>
      <BackButton />
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Title>CIBIL Score</Title>
        {data && !showForm && (
          <button onClick={() => setShowForm(true)} style={{ background: '#2990fc', color: 'white', border: 'none', borderRadius: '6px', padding: '6px 12px', cursor: 'pointer', fontWeight: 'bold' }}>Update</button>
        )}
      </div>

      {data && !showForm && (
        <Card>
          <ScoreBadge score={parseInt(data.score)}>{data.score}</ScoreBadge>
          <p style={{ textAlign: 'center', fontWeight: 'bold', fontSize: '1.1rem' }}>{getScoreLabel(parseInt(data.score))}</p>
          <p><strong>Last Checked:</strong> {data.lastChecked}</p>
        </Card>
      )}

      {showForm && (
        <form onSubmit={handleSubmit}>
          <Label>CIBIL Score (300–900)</Label>
          <Input type="number" min="300" max="900" value={formData.score}
            onChange={e => setFormData(p => ({ ...p, score: e.target.value }))} placeholder="e.g. 750" required />
          <Label>Date Last Checked</Label>
          <Input type="date" value={formData.lastChecked}
            onChange={e => setFormData(p => ({ ...p, lastChecked: e.target.value }))} required />
          <Button type="submit" disabled={loading}>{loading ? 'Saving...' : 'Save CIBIL Score'}</Button>
          {data && <Button danger type="button" onClick={() => { setFormData(data); setShowForm(false); }}>Cancel</Button>}
        </form>
      )}
      <ToastContainer position="bottom-right" autoClose={2000} />
    </Container>
  );
};

export default CIBILScore;