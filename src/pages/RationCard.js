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

const RationCard = () => {
  const [formData, setFormData] = useState({
    cardNumber: '',
    familyMembers: '',
    issuingAuthority: '',
    expiryDate: '',
    cardDocument: null,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    setFormData(prev => ({ ...prev, cardDocument: e.target.files[0] }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert('Ration Card details saved!');
    console.log('Submitted:', formData);
  };

  return (
    <Container>
      <BackButton />
      <Title>Ration Card</Title>
      <form onSubmit={handleSubmit}>
        <Label htmlFor="cardNumber">Card Number</Label>
        <Input
          id="cardNumber"
          name="cardNumber"
          type="text"
          value={formData.cardNumber}
          onChange={handleChange}
          placeholder="Ration card number"
          required
        />

        <Label htmlFor="familyMembers">Number of Family Members</Label>
        <Input
          id="familyMembers"
          name="familyMembers"
          type="number"
          value={formData.familyMembers}
          onChange={handleChange}
          placeholder="Total family members linked"
          required
        />

        <Label htmlFor="issuingAuthority">Issuing Authority</Label>
        <Input
          id="issuingAuthority"
          name="issuingAuthority"
          type="text"
          value={formData.issuingAuthority}
          onChange={handleChange}
          placeholder="Government body"
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

        <Label htmlFor="cardDocument">Upload Ration Card Document (PDF/Image)</Label>
        <Input
          id="cardDocument"
          name="cardDocument"
          type="file"
          accept="application/pdf,image/*"
          onChange={handleFileChange}
        />

        <Button type="submit">Save Ration Card</Button>
      </form>
    </Container>
  );
};

export default RationCard;
