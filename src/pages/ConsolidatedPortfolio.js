import React, { useState } from 'react';
import styled from 'styled-components';
import BackButton from '../components/BackButton';

const Container = styled.div`
  max-width: 700px;
  margin: auto;
  background: #fff;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 0 12px rgba(0,0,0,0.1);
`;

const Title = styled.h1`
  margin-bottom: 1.5rem;
`;

const Summary = styled.p`
  font-weight: bold;
  margin-bottom: 1.5rem;
`;

const Label = styled.label`
  display: block;
  margin-top: 1.2rem;
  font-weight: bold;
`;

const TextArea = styled.textarea`
  width: 100%;
  min-height: 100px;
  padding: 0.6rem;
  border-radius: 6px;
  border: 1px solid #ccc;
  margin-top: 0.5rem;
  resize: vertical;
`;

const Input = styled.input`
  width: 100%;
  padding: 0.6rem;
  border-radius: 6px;
  border: 1px solid #ccc;
  margin-top: 0.5rem;
`;

const Button = styled.button`
  margin-top: 1.8rem;
  background-color: #2990fc;
  color: white;
  padding: 0.9rem 1.7rem;
  border: none;
  border-radius: 7px;
  cursor: pointer;
  &:hover {
    background-color: #1a5fc1;
  }
`;

const ConsolidatedPortfolio = () => {
  const [formData, setFormData] = useState({
    assetsSummary: '',
    totalValue: '',
    portfolioDocument: null,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    setFormData(prev => ({ ...prev, portfolioDocument: e.target.files[0] }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert('Portfolio updated successfully!');
    console.log('Submitted data:', formData);
  };

  return (
    <Container>
      <BackButton />
      <Title>Consolidated Portfolio</Title>
      <Summary>Provide an overview of all your assets and investments in one place.</Summary>
      <form onSubmit={handleSubmit}>
        <Label htmlFor="assetsSummary">Assets Summary</Label>
        <TextArea
          id="assetsSummary"
          name="assetsSummary"
          value={formData.assetsSummary}
          onChange={handleChange}
          placeholder="Describe your assets: properties, investments, bank balances..."
          required
        />

        <Label htmlFor="totalValue">Total Portfolio Value (INR)</Label>
        <Input
          id="totalValue"
          name="totalValue"
          type="number"
          value={formData.totalValue}
          onChange={handleChange}
          placeholder="Total monetary value"
          required
        />

        <Label htmlFor="portfolioDocument">Upload Portfolio Document</Label>
        <Input
          id="portfolioDocument"
          name="portfolioDocument"
          type="file"
          accept="application/pdf,image/*"
          onChange={handleFileChange}
        />

        <Button type="submit">Save Portfolio</Button>
      </form>
    </Container>
  );
};

export default ConsolidatedPortfolio;
