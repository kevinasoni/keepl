import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import BackButton from '../components/BackButton';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const API_URL = process.env.REACT_APP_API_URL;

const Page = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg,#f6f9ff,#eef4ff);
  padding: 30px 10px;
`;

const Container = styled.div`
  max-width: 620px;
  margin: auto;
  background: #fff;
  padding: 2rem 1.5rem;
  border-radius: 14px;
  box-shadow: 0 10px 30px rgba(0,0,0,0.08);
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
`;

const Title = styled.h1`
  font-size: 2rem;
  font-weight: 600;
  color: #24305e;
`;

const PlusButton = styled.button`
  width: 40px;
  height: 40px;
  font-size: 24px;
  border-radius: 50%;
  border: none;
  cursor: pointer;
  background: #2990fc;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: 0.25s;
  &:hover { transform: scale(1.08); box-shadow: 0 5px 12px rgba(41,144,252,0.4); }
`;

const Label = styled.label`
  display: block;
  margin-top: 1.2rem;
  margin-bottom: 0.4rem;
  font-weight: 500;
  color: #334155;
`;

const Input = styled.input`
  width: 100%;
  padding: 0.65rem;
  border-radius: 6px;
  border: 1px solid #cfd8dc;
  font-size: 0.95rem;
  transition: 0.2s;
  &:focus { outline: none; border-color: #2990fc; box-shadow: 0 0 0 2px rgba(41,144,252,0.15); }
`;

const TextArea = styled.textarea`
  width: 100%;
  padding: 0.65rem;
  border-radius: 6px;
  border: 1px solid #cfd8dc;
  font-size: 0.95rem;
  resize: vertical;
  transition: 0.2s;
  &:focus { outline: none; border-color: #2990fc; box-shadow: 0 0 0 2px rgba(41,144,252,0.15); }
`;

const Button = styled.button`
  margin-top: 1.4rem;
  background: ${props => props.danger ? '#ef4444' : 'linear-gradient(90deg,#2990fc,#1a5fc1)'};
  color: white;
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 0.95rem;
  font-weight: 500;
  margin-right: 0.5rem;
  transition: 0.25s;
  &:hover { transform: translateY(-1px); opacity: 0.9; }
  &:disabled { opacity: 0.5; cursor: not-allowed; }
`;

const Card = styled.div`
  border: 1px solid #e2e8f0;
  padding: 1rem;
  border-radius: 10px;
  margin-top: 1rem;
  background: #f9fbff;
  transition: 0.25s;
  &:hover { transform: translateY(-2px); box-shadow: 0 6px 16px rgba(0,0,0,0.06); }
  p { margin: 6px 0; color: #334155; font-size: 0.95rem; }
`;

const MedicalInfo = () => {
  const emptyForm = { doctorName: '', prescriptions: '', medicalReportsFile: null };
  const [records, setRecords] = useState([]);
  const [formData, setFormData] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [showForm, setShowForm] = useState(true);
  const [loading, setLoading] = useState(false);

  const token = localStorage.getItem('authToken');
  const headers = { Authorization: `Bearer ${token}` };

  // ✅ Load records from MongoDB on mount
  useEffect(() => {
    fetchRecords();
  }, []);

  const fetchRecords = async () => {
    try {
      const res = await fetch(`${API_URL}/api/medical-info`, { headers });
      const data = await res.json();
      if (res.ok) {
        setRecords(data);
        if (data.length > 0) setShowForm(false);
      }
    } catch (err) {
      toast.error('Failed to load medical records');
    }
  };

  const handleChange = e => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = e => {
    setFormData(prev => ({ ...prev, medicalReportsFile: e.target.files[0] }));
  };

  const handleSubmit = async e => {
    e.preventDefault();

    if (formData.medicalReportsFile && formData.medicalReportsFile.size > 10 * 1024 * 1024) {
      toast.error('File size must be less than 10MB.');
      return;
    }

    setLoading(true);

    try {
      const form = new FormData();
      form.append('doctorName', formData.doctorName);
      form.append('prescriptions', formData.prescriptions);
      if (formData.medicalReportsFile) {
        form.append('file', formData.medicalReportsFile);
      }

      let res;
      if (editingId) {
        // ✅ Update existing record
        res = await fetch(`${API_URL}/api/medical-info/${editingId}`, {
          method: 'PUT',
          headers: { Authorization: `Bearer ${token}` },
          body: form,
        });
      } else {
        // ✅ Create new record
        res = await fetch(`${API_URL}/api/medical-info`, {
          method: 'POST',
          headers: { Authorization: `Bearer ${token}` },
          body: form,
        });
      }

      if (res.ok) {
        toast.success(editingId ? 'Updated!' : 'Saved!');
        setFormData(emptyForm);
        setEditingId(null);
        setShowForm(false);
        fetchRecords();
      } else {
        const data = await res.json();
        toast.error(data.error || 'Failed to save');
      }
    } catch (err) {
      toast.error('Network error');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (rec) => {
    setFormData({ doctorName: rec.doctorName, prescriptions: rec.prescriptions, medicalReportsFile: null });
    setEditingId(rec._id);
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id) => {
    try {
      const res = await fetch(`${API_URL}/api/medical-info/${id}`, {
        method: 'DELETE',
        headers,
      });
      if (res.ok) {
        toast.info('Deleted');
        fetchRecords();
      }
    } catch (err) {
      toast.error('Failed to delete');
    }
  };

  const handleAddNew = () => {
    setFormData(emptyForm);
    setEditingId(null);
    setShowForm(true);
  };

  return (
    <Page>
      <Container>
        <BackButton />
        <Header>
          <Title>Medical Info</Title>
          {records.length > 0 && !showForm && (
            <PlusButton onClick={handleAddNew}>＋</PlusButton>
          )}
        </Header>

        {showForm && (
          <form onSubmit={handleSubmit} autoComplete="off">
            <Label>Doctor's Name</Label>
            <Input name="doctorName" value={formData.doctorName} onChange={handleChange}
              placeholder="Dr. John Doe" required />

            <Label>Prescriptions / Notes</Label>
            <TextArea name="prescriptions" rows="4" value={formData.prescriptions}
              onChange={handleChange} placeholder="Medications, Dosage, Instructions" required />

            <Label>Upload Medical Reports (PDF/Image, max 10MB)</Label>
            <Input type="file" accept="application/pdf,image/*" onChange={handleFileChange} />

            <div>
              <Button type="submit" disabled={loading}>
                {loading ? 'Saving...' : editingId ? 'Update Medical Info' : 'Save Medical Info'}
              </Button>
              {editingId && (
                <Button danger type="button" onClick={() => { setEditingId(null); setFormData(emptyForm); setShowForm(false); }}>
                  Cancel
                </Button>
              )}
            </div>
          </form>
        )}

        {records.map((rec) => (
          <Card key={rec._id}>
            <p><strong>Doctor:</strong> {rec.doctorName}</p>
            <p><strong>Notes:</strong> {rec.prescriptions}</p>
            <p><strong>Report:</strong> {rec.medicalReport || 'No file uploaded'}</p>
            <Button onClick={() => handleEdit(rec)}>Edit</Button>
            <Button danger onClick={() => handleDelete(rec._id)}>Delete</Button>
          </Card>
        ))}
      </Container>
      <ToastContainer position="bottom-right" autoClose={2000} />
    </Page>
  );
};

export default MedicalInfo;