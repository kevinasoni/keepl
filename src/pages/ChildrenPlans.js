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

const ChildrenPlans = () => {
  const [formData, setFormData] = useState({
    childName: '',
    planType: '',
    premiumAmount: '',
    maturityDate: '',
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
    alert('Children plan details saved!');
    console.log('Submitted:', formData);
  };

  return (
    <Container>
      <BackButton />
      <Title>Children Plans</Title>
      <form onSubmit={handleSubmit}>
        <Label htmlFor="childName">Child's Name</Label>
        <Input
          id="childName"
          name="childName"
          type="text"
          value={formData.childName}
          onChange={handleChange}
          placeholder="Name of your child"
          required
        />

        <Label htmlFor="planType">Plan Type</Label>
        <Input
          id="planType"
          name="planType"
          type="text"
          value={formData.planType}
          onChange={handleChange}
          placeholder="Education, Health, etc."
          required
        />

        <Label htmlFor="premiumAmount">Premium Amount (INR)</Label>
        <Input
          id="premiumAmount"
          name="premiumAmount"
          type="number"
          value={formData.premiumAmount}
          onChange={handleChange}
          placeholder="Monthly/Annual premium"
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

        <Label htmlFor="policyDocument">Upload Policy Document (PDF/Image)</Label>
        <Input
          id="policyDocument"
          name="policyDocument"
          type="file"
          accept="application/pdf,image/*"
          onChange={handleFileChange}
        />

        <Button type="submit">Save Children's Plan</Button>
      </form>
    </Container>
  );
};

export default ChildrenPlans;
