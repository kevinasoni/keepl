import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import BackButton from '../components/BackButton';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const API_URL = process.env.REACT_APP_API_URL;

const Container = styled.div`max-width: 700px; margin: auto; background: #fff; padding: 2rem; border-radius: 8px; box-shadow: 0 0 12px rgba(0,0,0,0.1);`;
const Title = styled.h1`margin-bottom: 1.5rem;`;
const Label = styled.label`display: block; margin-top: 1.2rem; font-weight: bold;`;
const TextArea = styled.textarea`width: 100%; min-height: 100px; padding: 0.6rem; border-radius: 6px; border: 1px solid #ccc; margin-top: 0.5rem; resize: vertical;`;
const Input = styled.input`width: 100%; padding: 0.6rem; border-radius: 6px; border: 1px solid #ccc; margin-top: 0.5rem;`;
const Button = styled.button`
  margin-top: 1.8rem; background-color: ${p => p.danger ? '#ef4444' : '#2990fc'}; color: white;
  padding: 0.9rem 1.7rem; border: none; border-radius: 7px; cursor: pointer; margin-right: 0.5rem; font-weight: bold;
  &:hover { opacity: 0.9; } &:disabled { opacity: 0.5; cursor: not-allowed; }
`;
const Card = styled.div`border: 1px solid #e2e8f0; padding: 1.2rem; border-radius: 10px; margin-top: 1rem; background: #f9fbff; p { margin: 6px 0; }`;

const emptyForm = { assetsSummary: '', totalValue: '' };

const ConsolidatedPortfolio = () => {
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
      if (res.ok && d.data?.consolidatedPortfolio) {
        setData(d.data.consolidatedPortfolio);
        setFormData(d.data.consolidatedPortfolio);
        setShowForm(false);
      }
    } catch (err) { console.error('Failed to load'); }
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); setLoading(true);
    const res = await fetch(`${API_URL}/api/user-data`, {
      method: 'POST', headers: authHeaders,
      body: JSON.stringify({ consolidatedPortfolio: formData }),
    });
    if (res.ok) {
      toast.success('Portfolio saved!');
      setData(formData); setShowForm(false);
    } else toast.error('Failed to save');
    setLoading(false);
  };

  return (
    <Container>
      <BackButton />
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Title>Consolidated Portfolio</Title>
        {data && !showForm && (
          <button onClick={() => setShowForm(true)} style={{ background: '#2990fc', color: 'white', border: 'none', borderRadius: '6px', padding: '6px 12px', cursor: 'pointer', fontWeight: 'bold' }}>Edit</button>
        )}
      </div>

      {data && !showForm && (
        <Card>
          <p><strong>Total Value:</strong> ₹{parseInt(data.totalValue).toLocaleString('en-IN')}</p>
          <p><strong>Assets Summary:</strong></p>
          <p style={{ whiteSpace: 'pre-wrap', color: '#555' }}>{data.assetsSummary}</p>
        </Card>
      )}

      {showForm && (
        <form onSubmit={handleSubmit}>
          <p style={{ color: '#666', marginBottom: '1rem' }}>Provide an overview of all your assets and investments in one place.</p>
          <Label>Assets Summary</Label>
          <TextArea value={formData.assetsSummary}
            onChange={e => setFormData(p => ({ ...p, assetsSummary: e.target.value }))}
            placeholder="Describe your assets: properties, investments, bank balances..."
            required />
          <Label>Total Portfolio Value (INR)</Label>
          <Input type="number" value={formData.totalValue}
            onChange={e => setFormData(p => ({ ...p, totalValue: e.target.value }))}
            placeholder="Total monetary value" required />
          <Button type="submit" disabled={loading}>{loading ? 'Saving...' : 'Save Portfolio'}</Button>
          {data && <Button danger type="button" onClick={() => { setFormData(data); setShowForm(false); }}>Cancel</Button>}
        </form>
      )}
      <ToastContainer position="bottom-right" autoClose={2000} />
    </Container>
  );
};

export default ConsolidatedPortfolio;