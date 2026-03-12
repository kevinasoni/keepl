// RationCard.js
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

const emptyRation = { cardNumber: '', familyMembers: '', issuingAuthority: '', expiryDate: '' };

const RationCard = () => {
  const [data, setData] = useState(null);
  const [formData, setFormData] = useState(emptyRation);
  const [showForm, setShowForm] = useState(true);
  const [loading, setLoading] = useState(false);

  const token = localStorage.getItem('authToken');
  const authHeaders = { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` };

  useEffect(() => { fetchData(); }, []);

  const fetchData = async () => {
    try {
      const res = await fetch(`${API_URL}/api/user-data`, { headers: authHeaders });
      const d = await res.json();
      if (res.ok && d.data?.rationCard) { setData(d.data.rationCard); setFormData(d.data.rationCard); setShowForm(false); }
    } catch (err) { console.error('Failed to load'); }
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); setLoading(true);
    const res = await fetch(`${API_URL}/api/user-data`, {
      method: 'POST', headers: authHeaders,
      body: JSON.stringify({ rationCard: formData }),
    });
    if (res.ok) {
      toast.success('Ration card saved!');
      setData(formData); setShowForm(false);
    } else toast.error('Failed to save');
    setLoading(false);
  };

  return (
    <Container>
      <BackButton />
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Title>Ration Card</Title>
        {data && !showForm && (
          <button onClick={() => setShowForm(true)} style={{ background: '#2990fc', color: 'white', border: 'none', borderRadius: '6px', padding: '6px 12px', cursor: 'pointer', fontWeight: 'bold' }}>Edit</button>
        )}
      </div>
      {showForm && (
        <form onSubmit={handleSubmit}>
          <Label>Card Number</Label>
          <Input value={formData.cardNumber} onChange={e => setFormData(p => ({ ...p, cardNumber: e.target.value }))} placeholder="Ration card number" required />
          <Label>Number of Family Members</Label>
          <Input type="number" value={formData.familyMembers} onChange={e => setFormData(p => ({ ...p, familyMembers: e.target.value }))} placeholder="Total family members" required />
          <Label>Issuing Authority</Label>
          <Input value={formData.issuingAuthority} onChange={e => setFormData(p => ({ ...p, issuingAuthority: e.target.value }))} placeholder="Government body" required />
          <Label>Expiry Date</Label>
          <Input type="date" value={formData.expiryDate} onChange={e => setFormData(p => ({ ...p, expiryDate: e.target.value }))} required />
          <Button type="submit" disabled={loading}>{loading ? 'Saving...' : 'Save Ration Card'}</Button>
          {data && <Button danger type="button" onClick={() => { setFormData(data); setShowForm(false); }}>Cancel</Button>}
        </form>
      )}
      {data && !showForm && (
        <Card>
          <p><strong>Card Number:</strong> {data.cardNumber}</p>
          <p><strong>Family Members:</strong> {data.familyMembers}</p>
          <p><strong>Authority:</strong> {data.issuingAuthority}</p>
          <p><strong>Expiry:</strong> {data.expiryDate}</p>
        </Card>
      )}
      <ToastContainer position="bottom-right" autoClose={2000} />
    </Container>
  );
};

export default RationCard;