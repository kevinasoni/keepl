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

const Insurance = () => {
  const [formData, setFormData] = useState({
    policyProvider: '',
    policyNumber: '',
    policyType: '',
    coverageAmount: '',
    expiryDate: '',
    policyDocument: null,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    setFormData(prev => ({ ...prev, policyDocument: e.target.files[0] }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert('Insurance details submitted!');
    console.log('Submitted:', formData);
  };

  return (
    <Container>
      <BackButton />
      <Title>Insurance</Title>
      <form onSubmit={handleSubmit}>
        <Label htmlFor="policyProvider">Policy Provider</Label>
        <Input
          id="policyProvider"
          name="policyProvider"
          type="text"
          value={formData.policyProvider}
          onChange={handleChange}
          placeholder="e.g. LIC, ICICI"
          required
        />

        <Label htmlFor="policyNumber">Policy Number</Label>
        <Input
          id="policyNumber"
          name="policyNumber"
          type="text"
          value={formData.policyNumber}
          onChange={handleChange}
          placeholder="Policy number"
          required
        />

        <Label htmlFor="policyType">Policy Type</Label>
        <Input
          id="policyType"
          name="policyType"
          type="text"
          value={formData.policyType}
          onChange={handleChange}
          placeholder="Life, Vehicle, Health"
          required
        />

        <Label htmlFor="coverageAmount">Coverage Amount (INR)</Label>
        <Input
          id="coverageAmount"
          name="coverageAmount"
          type="number"
          value={formData.coverageAmount}
          onChange={handleChange}
          placeholder="e.g. 500000"
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

        <Label htmlFor="policyDocument">Upload Policy Document (PDF/Image)</Label>
        <Input
          id="policyDocument"
          name="policyDocument"
          type="file"
          accept="application/pdf,image/*"
          onChange={handleFileChange}
        />

        <Button type="submit">Save Insurance</Button>
      </form>
    </Container>
  );
};

export default Insurance;
