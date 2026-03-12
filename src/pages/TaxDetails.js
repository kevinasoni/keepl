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
const Select = styled.select`width: 100%; padding: 0.6rem; border-radius: 4px; border: 1px solid #ccc; margin-top: 0.5rem;`;
const Button = styled.button`
  margin-top: 1.5rem; background-color: ${p => p.danger ? '#ef4444' : '#2990fc'}; color: white;
  padding: 0.8rem 1.5rem; border: none; border-radius: 6px; cursor: pointer; margin-right: 0.5rem; font-weight: bold;
  &:hover { opacity: 0.9; } &:disabled { opacity: 0.5; cursor: not-allowed; }
`;
const Card = styled.div`border: 1px solid #e2e8f0; padding: 1rem; border-radius: 10px; margin-top: 1rem; background: #f9fbff; p { margin: 4px 0; }`;

const emptyForm = { assessmentYear: '', income: '', taxPaid: '' };

const TaxDetails = () => {
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
      if (res.ok && data.data?.taxDetails) { setRecords(data.data.taxDetails); setShowForm(false); }
    } catch (err) { console.error('Failed to load'); }
  };

  const saveData = async (updated) => {
    const res = await fetch(`${API_URL}/api/user-data`, {
      method: 'POST', headers: authHeaders,
      body: JSON.stringify({ taxDetails: updated }),
    });
    return res.ok;
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); setLoading(true);
    const updated = editingIndex !== null
      ? records.map((r, i) => i === editingIndex ? formData : r)
      : [...records, { ...formData, id: Date.now() }];
    if (await saveData(updated)) {
      toast.success(editingIndex !== null ? 'Updated!' : 'Tax details saved!');
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
        <Title>Tax Details</Title>
        {records.length > 0 && !showForm && (
          <button onClick={() => setShowForm(true)} style={{ background: '#2990fc', color: 'white', border: 'none', borderRadius: '50%', width: 36, height: 36, fontSize: 22, cursor: 'pointer' }}>+</button>
        )}
      </div>
      {showForm && (
        <form onSubmit={handleSubmit}>
          <Label>Assessment Year</Label>
          <Select value={formData.assessmentYear} onChange={e => setFormData(p => ({ ...p, assessmentYear: e.target.value }))} required>
            <option value="">Select Year</option>
            <option value="2025-26">2025-26</option>
            <option value="2024-25">2024-25</option>
            <option value="2023-24">2023-24</option>
            <option value="2022-23">2022-23</option>
          </Select>
          <Label>Total Income (INR)</Label>
          <Input type="number" value={formData.income} onChange={e => setFormData(p => ({ ...p, income: e.target.value }))} placeholder="e.g. 800000" required />
          <Label>Tax Paid (INR)</Label>
          <Input type="number" value={formData.taxPaid} onChange={e => setFormData(p => ({ ...p, taxPaid: e.target.value }))} placeholder="e.g. 50000" required />
          <Button type="submit" disabled={loading}>{loading ? 'Saving...' : editingIndex !== null ? 'Update' : 'Save Tax Details'}</Button>
          {editingIndex !== null && <Button danger type="button" onClick={() => { setEditingIndex(null); setFormData(emptyForm); setShowForm(false); }}>Cancel</Button>}
        </form>
      )}
      {records.map((r, i) => (
        <Card key={i}>
          <p><strong>Year:</strong> {r.assessmentYear}</p>
          <p><strong>Income:</strong> ₹{r.income}</p>
          <p><strong>Tax Paid:</strong> ₹{r.taxPaid}</p>
          <Button onClick={() => { setFormData(r); setEditingIndex(i); setShowForm(true); }}>Edit</Button>
          <Button danger onClick={() => handleDelete(i)}>Delete</Button>
        </Card>
      ))}
      <ToastContainer position="bottom-right" autoClose={2000} />
    </Container>
  );
};

export default TaxDetails;