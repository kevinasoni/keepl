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

const PropertyInfo = () => {
  const [formData, setFormData] = useState({
    propertyType: '',
    address: '',
    marketValue: '',
    ownershipProofFile: null,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    setFormData(prev => ({ ...prev, ownershipProofFile: e.target.files[0] }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert('Property info saved!');
    console.log('Submitted:', formData);
  };

  return (
    <Container>
      <BackButton />
      <Title>Property Information</Title>
      <form onSubmit={handleSubmit}>
        <Label htmlFor="propertyType">Property Type</Label>
        <Input
          id="propertyType"
          name="propertyType"
          type="text"
          value={formData.propertyType}
          onChange={handleChange}
          placeholder="Apartment, Land, Commercial"
          required
        />

        <Label htmlFor="address">Address</Label>
        <Input
          id="address"
          name="address"
          type="text"
          value={formData.address}
          onChange={handleChange}
          placeholder="Property address"
          required
        />

        <Label htmlFor="marketValue">Market Value (INR)</Label>
        <Input
          id="marketValue"
          name="marketValue"
          type="number"
          value={formData.marketValue}
          onChange={handleChange}
          placeholder="Current market value"
          required
        />

        <Label htmlFor="ownershipProofFile">Upload Ownership Proof (PDF/Image)</Label>
        <Input
          id="ownershipProofFile"
          name="ownershipProofFile"
          type="file"
          accept="application/pdf,image/*"
          onChange={handleFileChange}
        />

        <Button type="submit">Save Property Info</Button>
      </form>
    </Container>
  );
};

export default PropertyInfo;
