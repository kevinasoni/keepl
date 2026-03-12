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

const emptyForm = { policyProvider: '', policyNumber: '', policyType: '', coverageAmount: '', expiryDate: '' };

const Insurance = () => {
  const [records, setRecords] = useState([]);
  const [formData, setFormData] = useState(emptyForm);
  const [editingIndex, setEditingIndex] = useState(null);
  const [showForm, setShowForm] = useState(true);
  const [loading, setLoading] = useState(false);

  const token = localStorage.getItem('authToken');
  const authHeaders = { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` };

  useEffect(() => { fetchData(); }, []);

  const fetchData = async () => {
    try {
      const res = await fetch(`${API_URL}/api/user-data`, { headers: authHeaders });
      const data = await res.json();
      if (res.ok && data.data?.insurance) { setRecords(data.data.insurance); setShowForm(false); }
    } catch (err) { console.error('Failed to load'); }
  };

  const saveData = async (updated) => {
    const res = await fetch(`${API_URL}/api/user-data`, {
      method: 'POST', headers: authHeaders,
      body: JSON.stringify({ insurance: updated }),
    });
    return res.ok;
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); setLoading(true);
    const updated = editingIndex !== null
      ? records.map((r, i) => i === editingIndex ? formData : r)
      : [...records, { ...formData, id: Date.now() }];
    if (await saveData(updated)) {
      toast.success(editingIndex !== null ? 'Updated!' : 'Insurance saved!');
      setRecords(updated); setFormData(emptyForm); setEditingIndex(null); setShowForm(false);
    } else toast.error('Failed to save');
    setLoading(false);
  };

  const handleDelete = async (i) => {
    const updated = records.filter((_, idx) => idx !== i);
    if (await saveData(updated)) { toast.info('Deleted'); setRecords(updated); }
    else toast.error('Failed to delete');
  };

  return (
    <Container>
      <BackButton />
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Title>Insurance</Title>
        {records.length > 0 && !showForm && (
          <button onClick={() => setShowForm(true)} style={{ background: '#2990fc', color: 'white', border: 'none', borderRadius: '50%', width: 36, height: 36, fontSize: 22, cursor: 'pointer' }}>+</button>
        )}
      </div>

      {showForm && (
        <form onSubmit={handleSubmit}>
          <Label>Policy Provider</Label>
          <Input value={formData.policyProvider} onChange={e => setFormData(p => ({ ...p, policyProvider: e.target.value }))} placeholder="e.g. LIC, ICICI" required />
          <Label>Policy Number</Label>
          <Input value={formData.policyNumber} onChange={e => setFormData(p => ({ ...p, policyNumber: e.target.value }))} placeholder="Policy number" required />
          <Label>Policy Type</Label>
          <Input value={formData.policyType} onChange={e => setFormData(p => ({ ...p, policyType: e.target.value }))} placeholder="Life, Vehicle, Health" required />
          <Label>Coverage Amount (INR)</Label>
          <Input type="number" value={formData.coverageAmount} onChange={e => setFormData(p => ({ ...p, coverageAmount: e.target.value }))} placeholder="e.g. 500000" required />
          <Label>Expiry Date</Label>
          <Input type="date" value={formData.expiryDate} onChange={e => setFormData(p => ({ ...p, expiryDate: e.target.value }))} required />
          <Button type="submit" disabled={loading}>{loading ? 'Saving...' : editingIndex !== null ? 'Update' : 'Save Insurance'}</Button>
          {editingIndex !== null && <Button danger type="button" onClick={() => { setEditingIndex(null); setFormData(emptyForm); setShowForm(false); }}>Cancel</Button>}
        </form>
      )}

      {records.map((r, i) => (
        <Card key={i}>
          <p><strong>Provider:</strong> {r.policyProvider}</p>
          <p><strong>Policy #:</strong> {r.policyNumber}</p>
          <p><strong>Type:</strong> {r.policyType}</p>
          <p><strong>Coverage:</strong> ₹{r.coverageAmount}</p>
          <p><strong>Expiry:</strong> {r.expiryDate}</p>
          <Button onClick={() => { setFormData(r); setEditingIndex(i); setShowForm(true); }}>Edit</Button>
          <Button danger onClick={() => handleDelete(i)}>Delete</Button>
        </Card>
      ))}
      <ToastContainer position="bottom-right" autoClose={2000} />
    </Container>
  );
};

export default Insurance;