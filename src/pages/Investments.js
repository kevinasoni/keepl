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

const Investments = () => {
  const [formData, setFormData] = useState({
    investmentType: '',
    provider: '',
    amount: '',
    maturityDate: '',
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
    alert('Investment details saved!');
    console.log('Submitted:', formData);
  };

  return (
    <Container>
      <BackButton />
      <Title>Investments</Title>
      <form onSubmit={handleSubmit}>
        <Label htmlFor="investmentType">Investment Type</Label>
        <Input
          id="investmentType"
          name="investmentType"
          type="text"
          value={formData.investmentType}
          onChange={handleChange}
          placeholder="PPF, LIC, FD, Mutual Funds"
          required
        />
        <Label htmlFor="provider">Provider</Label>
        <Input
          id="provider"
          name="provider"
          type="text"
          value={formData.provider}
          onChange={handleChange}
          placeholder="Bank or financial institution"
          required
        />
        <Label htmlFor="amount">Amount (INR)</Label>
        <Input
          id="amount"
          name="amount"
          type="number"
          value={formData.amount}
          onChange={handleChange}
          placeholder="Investment amount"
          required
        />
        <Label htmlFor="maturityDate">Maturity Date</Label>
        <Input
          id="maturityDate"
          name="maturityDate"
          type="date"
          value={formData.maturityDate}
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

        <Button type="submit">Save Investment</Button>
      </form>
    </Container>
  );
};

export default Investments;
