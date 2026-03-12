// BankAccounts.js
import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import BackButton from '../components/BackButton';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const API_URL = process.env.REACT_APP_API_URL;

const Container = styled.div`
  max-width: 600px;
  margin: 2.5rem auto 1rem auto;
  background: #fff;
  padding: 2rem 1.2rem;
  border-radius: 12px;
  box-shadow: 0 0 14px rgba(0,0,0,0.08);
`;
const Title = styled.h1`margin-bottom: 1.5rem; font-size: 2rem; font-weight: 600; color: #24305e;`;
const Label = styled.label`display: block; margin-top: 1.2rem; margin-bottom: 0.5rem; font-weight: 500; color: #1e293b;`;
const Input = styled.input`width: 100%; padding: 0.6rem; border-radius: 5px; border: 1px solid #cfd8dc; margin-bottom: 0.3rem; font-size: 1rem;`;
const Button = styled.button`
  margin-top: 1.5rem;
  background-color: ${props => props.danger ? '#ef4444' : '#2990fc'};
  color: white; padding: 0.8rem 1.5rem; border: none; border-radius: 6px; cursor: pointer; font-size: 1rem; margin-right: 0.5rem; font-weight: bold;
  &:hover { opacity: 0.9; }
  &:disabled { opacity: 0.5; cursor: not-allowed; }
`;
const Card = styled.div`
  border: 1px solid #e2e8f0; padding: 1rem; border-radius: 10px; margin-top: 1rem; background: #f9fbff;
  p { margin: 4px 0; color: #334155; }
`;

const BankAccounts = () => {
  const [records, setRecords] = useState([]);
  const [formData, setFormData] = useState({ bankName: '', accountNumber: '', ifscCode: '', accountType: '' });
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
      if (res.ok && data.data?.bankAccounts) {
        setRecords(data.data.bankAccounts);
        setShowForm(false);
      }
    } catch (err) { console.error('Failed to load'); }
  };

  const saveData = async (updatedRecords) => {
    const res = await fetch(`${API_URL}/api/user-data`, {
      headers: authHeaders,
      method: 'POST',
      body: JSON.stringify({ bankAccounts: updatedRecords }),
    });
    return res.ok;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    let updated;
    if (editingIndex !== null) {
      updated = [...records];
      updated[editingIndex] = formData;
    } else {
      updated = [...records, { ...formData, id: Date.now() }];
    }
    const ok = await saveData(updated);
    if (ok) {
      toast.success(editingIndex !== null ? 'Updated!' : 'Bank account saved!');
      setRecords(updated);
      setFormData({ bankName: '', accountNumber: '', ifscCode: '', accountType: '' });
      setEditingIndex(null);
      setShowForm(false);
    } else {
      toast.error('Failed to save');
    }
    setLoading(false);
  };

  const handleDelete = async (index) => {
    const updated = records.filter((_, i) => i !== index);
    const ok = await saveData(updated);
    if (ok) { toast.info('Deleted'); setRecords(updated); }
    else toast.error('Failed to delete');
  };

  return (
    <Container>
      <BackButton />
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Title>Bank Accounts</Title>
        {records.length > 0 && !showForm && (
          <button onClick={() => setShowForm(true)} style={{ background: '#2990fc', color: 'white', border: 'none', borderRadius: '50%', width: 36, height: 36, fontSize: 22, cursor: 'pointer' }}>+</button>
        )}
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} autoComplete="off">
          <Label>Bank Name</Label>
          <Input name="bankName" value={formData.bankName} onChange={e => setFormData(p => ({ ...p, bankName: e.target.value }))} placeholder="e.g. State Bank of India" required />
          <Label>Account Number</Label>
          <Input name="accountNumber" value={formData.accountNumber} onChange={e => setFormData(p => ({ ...p, accountNumber: e.target.value }))} placeholder="Account number" required />
          <Label>IFSC Code</Label>
          <Input name="ifscCode" value={formData.ifscCode} onChange={e => setFormData(p => ({ ...p, ifscCode: e.target.value }))} placeholder="e.g. SBIN0000123" required />
          <Label>Account Type</Label>
          <Input name="accountType" value={formData.accountType} onChange={e => setFormData(p => ({ ...p, accountType: e.target.value }))} placeholder="Savings / Current" required />
          <Button type="submit" disabled={loading}>{loading ? 'Saving...' : editingIndex !== null ? 'Update' : 'Save Bank Account'}</Button>
          {editingIndex !== null && <Button danger type="button" onClick={() => { setEditingIndex(null); setFormData({ bankName: '', accountNumber: '', ifscCode: '', accountType: '' }); setShowForm(false); }}>Cancel</Button>}
        </form>
      )}

      {records.map((r, i) => (
        <Card key={i}>
          <p><strong>Bank:</strong> {r.bankName}</p>
          <p><strong>Account:</strong> {r.accountNumber}</p>
          <p><strong>IFSC:</strong> {r.ifscCode}</p>
          <p><strong>Type:</strong> {r.accountType}</p>
          <Button onClick={() => { setFormData(r); setEditingIndex(i); setShowForm(true); }}>Edit</Button>
          <Button danger onClick={() => handleDelete(i)}>Delete</Button>
        </Card>
      ))}
      <ToastContainer position="bottom-right" autoClose={2000} />
    </Container>
  );
};

export default BankAccounts;