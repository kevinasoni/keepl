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

const Select = styled.select`
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

const TaxDetails = () => {
  const [formData, setFormData] = useState({
    assessmentYear: '',
    income: '',
    taxPaid: '',
    itrFile: null,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    setFormData(prev => ({ ...prev, itrFile: e.target.files[0] }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert('Tax details submitted successfully!');
    console.log('Submitted data:', formData);
  };

  return (
    <Container>
      <BackButton />
      <Title>Tax Details</Title>
      <form onSubmit={handleSubmit}>
        <Label htmlFor="assessmentYear">Assessment Year</Label>
        <Select
          id="assessmentYear"
          name="assessmentYear"
          value={formData.assessmentYear}
          onChange={handleChange}
          required
        >
          <option value="">Select Year</option>
          <option value="2025-26">2025-26</option>
          <option value="2024-25">2024-25</option>
          <option value="2023-24">2023-24</option>
          <option value="2022-23">2022-23</option>
        </Select>

        <Label htmlFor="income">Total Income (INR)</Label>
        <Input
          id="income"
          name="income"
          type="number"
          value={formData.income}
          onChange={handleChange}
          placeholder="eg. 800000"
          required
        />

        <Label htmlFor="taxPaid">Tax Paid (INR)</Label>
        <Input
          id="taxPaid"
          name="taxPaid"
          type="number"
          value={formData.taxPaid}
          onChange={handleChange}
          placeholder="eg. 50000"
          required
        />

        <Label htmlFor="itrFile">Upload ITR (PDF)</Label>
        <Input
          id="itrFile"
          name="itrFile"
          type="file"
          accept="application/pdf"
          onChange={handleFileChange}
        />

        <Button type="submit">Save Tax Details</Button>
      </form>
    </Container>
  );
};

export default TaxDetails;
