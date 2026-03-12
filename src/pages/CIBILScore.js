import React, { useState } from 'react';
import styled from 'styled-components';
import BackButton from '../components/BackButton';

const Container = styled.div`
  max-width: 600px;
  margin: auto;
  background: #fff;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 0 10px rgba(0,0,0,0.1);
`;

const Title = styled.h1`
  margin-bottom: 1.5rem;
`;

const Label = styled.label`
  display: block;
  margin-top: 1rem;
  font-weight: bold;
`;

const Input = styled.input`
  width: 100%;
  padding: 0.6rem;
  border-radius: 4px;
  border: 1px solid #ccc;
  margin-top: 0.5rem;
`;

const Button = styled.button`
  margin-top: 1.5rem;
  background-color: #2990fc;
  color: white;
  padding: 0.8rem 1.5rem;
  border: none;
  border-radius: 6px;
  cursor: pointer;

  &:hover {
    background-color: #1a5fc1;
  }
`;

const CIBILScore = () => {
  const [formData, setFormData] = useState({
    score: '',
    lastChecked: '',
    reportFile: null,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    setFormData(prev => ({ ...prev, reportFile: e.target.files[0] }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert('CIBIL Score details submitted!');
    console.log('Submitted:', formData);
  };

  return (
    <Container>
      <BackButton />
      <Title>CIBIL Score</Title>
      <form onSubmit={handleSubmit}>
        <Label htmlFor="score">CIBIL Score</Label>
        <Input
          id="score"
          name="score"
          type="number"
          min="300"
          max="900"
          value={formData.score}
          onChange={handleChange}
          placeholder="eg. 750"
          required
        />

        <Label htmlFor="lastChecked">Date Last Checked</Label>
        <Input
          id="lastChecked"
          name="lastChecked"
          type="date"
          value={formData.lastChecked}
          onChange={handleChange}
          required
        />

        <Label htmlFor="reportFile">Upload CIBIL Report (PDF, Image)</Label>
        <Input
          id="reportFile"
          name="reportFile"
          type="file"
          accept="application/pdf,image/*"
          onChange={handleFileChange}
        />

        <Button type="submit">Save Details</Button>
      </form>
    </Container>
  );
};

export default CIBILScore;
