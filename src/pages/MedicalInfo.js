import React, { useState } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import BackButton from '../components/BackButton';

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

  &:hover{
    transform: scale(1.08);
    box-shadow: 0 5px 12px rgba(41,144,252,0.4);
  }
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

  &:focus{
    outline: none;
    border-color: #2990fc;
    box-shadow: 0 0 0 2px rgba(41,144,252,0.15);
  }
`;

const TextArea = styled.textarea`
  width: 100%;
  padding: 0.65rem;
  border-radius: 6px;
  border: 1px solid #cfd8dc;
  font-size: 0.95rem;
  resize: vertical;
  transition: 0.2s;

  &:focus{
    outline: none;
    border-color: #2990fc;
    box-shadow: 0 0 0 2px rgba(41,144,252,0.15);
  }
`;

const Button = styled.button`
  margin-top: 1.4rem;
  background: linear-gradient(90deg,#2990fc,#1a5fc1);
  color: white;
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 0.95rem;
  font-weight: 500;
  transition: 0.25s;

  &:hover{
    transform: translateY(-1px);
    box-shadow: 0 6px 14px rgba(41,144,252,0.3);
  }
`;

const Card = styled.div`
  border: 1px solid #e2e8f0;
  padding: 1rem;
  border-radius: 10px;
  margin-top: 1rem;
  background: #f9fbff;
  transition: 0.25s;

  &:hover{
    transform: translateY(-2px);
    box-shadow: 0 6px 16px rgba(0,0,0,0.06);
  }

  p{
    margin: 6px 0;
    color: #334155;
    font-size: 0.95rem;
  }
`;

const MedicalInfo = () => {

  const navigate = useNavigate();

  const emptyForm = {
    doctorName: '',
    prescriptions: '',
    medicalReportsFile: null
  };

  const [records, setRecords] = useState([]);
  const [formData, setFormData] = useState(emptyForm);
  const [editingIndex, setEditingIndex] = useState(null);

  const handleChange = e => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = e => {
    setFormData(prev => ({ ...prev, medicalReportsFile: e.target.files[0] }));
  };

  const handleSubmit = e => {
    e.preventDefault();

    if (formData.medicalReportsFile && formData.medicalReportsFile.size > 10 * 1024 * 1024) {
      alert('File size must be less than 10MB.');
      return;
    }

    const updated = [...records];

    if (editingIndex !== null) {
      updated[editingIndex] = formData;
    } else {
      updated.push(formData);
    }

    setRecords(updated);
    setFormData(emptyForm);
    setEditingIndex(null);
  };

  const handleEdit = index => {
    setFormData(records[index]);
    setEditingIndex(index);
  };

  const handleAddNew = () => {
    setFormData(emptyForm);
    setEditingIndex(null);
  };

  return (
    <Page>
      <Container>

        <BackButton />

        <Header>
          <Title>Medical Info</Title>
          {records.length > 0 && <PlusButton onClick={handleAddNew}>＋</PlusButton>}
        </Header>

        {(records.length === 0 || editingIndex !== null) && (
          <form onSubmit={handleSubmit} autoComplete="off">

            <Label>Doctor's Name</Label>
            <Input
              name="doctorName"
              value={formData.doctorName}
              onChange={handleChange}
              placeholder="Dr. John Doe"
              required
            />

            <Label>Prescriptions / Notes</Label>
            <TextArea
              name="prescriptions"
              rows="4"
              value={formData.prescriptions}
              onChange={handleChange}
              placeholder="Medications, Dosage, Instructions"
              required
            />

            <Label>Upload Medical Reports</Label>
            <Input
              type="file"
              accept="application/pdf,image/*"
              onChange={handleFileChange}
            />

            <Button type="submit">
              {editingIndex !== null ? 'Update Medical Info' : 'Save Medical Info'}
            </Button>

          </form>
        )}

        {editingIndex === null &&
          records.map((rec, index) => (
            <Card key={index}>
              <p>Doctor: {rec.doctorName}</p>
              <p>Notes: {rec.prescriptions}</p>
              <p>
                Report: {rec.medicalReportsFile ? rec.medicalReportsFile.name : 'Uploaded'}
              </p>
              <Button onClick={() => handleEdit(index)}>Edit</Button>
            </Card>
          ))}

      </Container>
    </Page>
  );
};

export default MedicalInfo;