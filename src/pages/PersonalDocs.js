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

const PersonalDocs = () => {
  const [formData, setFormData] = useState({
    documentType: '',
    documentNumber: '',
    issuingAuthority: '',
    expiryDate: '',
    documentFile: null,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    setFormData(prev => ({ ...prev, documentFile: e.target.files[0] }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert('Personal document saved!');
    console.log('Submitted:', formData);
  };

  return (
    <Container>
      <BackButton />
      <Title>Personal Documents</Title>
      <form onSubmit={handleSubmit}>
        <Label htmlFor="documentType">Document Type</Label>
        <Input
          id="documentType"
          name="documentType"
          type="text"
          value={formData.documentType}
          onChange={handleChange}
          placeholder="Passport, License, Aadhaar"
          required
        />

        <Label htmlFor="documentNumber">Document Number</Label>
        <Input
          id="documentNumber"
          name="documentNumber"
          type="text"
          value={formData.documentNumber}
          onChange={handleChange}
          placeholder="Number on document"
          required
        />

        <Label htmlFor="issuingAuthority">Issuing Authority</Label>
        <Input
          id="issuingAuthority"
          name="issuingAuthority"
          type="text"
          value={formData.issuingAuthority}
          onChange={handleChange}
          placeholder="Government or issuing body"
          required
        />

        <Label htmlFor="expiryDate">Expiry Date</Label>
        <Input
          id="expiryDate"
          name="expiryDate"
          type="date"
          value={formData.expiryDate}
          onChange={handleChange}
          required
        />

        <Label htmlFor="documentFile">Upload Document (PDF/Image)</Label>
        <Input
          id="documentFile"
          name="documentFile"
          type="file"
          accept="application/pdf,image/*"
          onChange={handleFileChange}
        />

        <Button type="submit">Save Document</Button>
      </form>
    </Container>
  );
};

export default PersonalDocs;
