import React, { useState } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import BackButton from '../components/BackButton';

const Container = styled.div`
  max-width: 600px;
  margin: 2.5rem auto 1rem auto;
  background: #fff;
  padding: 2rem 1.2rem;
  border-radius: 12px;
  box-shadow: 0 0 14px rgba(0,0,0,0.08);
`;

const Title = styled.h1`
  margin-bottom: 1.5rem;
  font-size: 2rem;
  font-weight: 600;
  color: #24305e;
`;

const Label = styled.label`
  display: block;
  margin-top: 1.2rem;
  margin-bottom: 0.5rem;
  font-weight: 500;
  color: #1e293b;
`;

const Input = styled.input`
  width: 100%;
  padding: 0.6rem;
  border-radius: 5px;
  border: 1px solid #cfd8dc;
  margin-bottom: 0.3rem;
  font-size: 1rem;
`;

const Button = styled.button`
  margin-top: 1.5rem;
  background-color: #2990fc;
  color: white;
  padding: 0.8rem 1.5rem;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 1rem;

  &:hover {
    background-color: #1a5fc1;
  }
`;

const BankAccounts = () => {
  const [formData, setFormData] = useState({
    bankName: '',
    accountNumber: '',
    ifscCode: '',
    accountType: '',
    bankStatementFile: null,
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    setFormData(prev => ({ ...prev, bankStatementFile: e.target.files[0] }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (formData.bankStatementFile && formData.bankStatementFile.size > 10 * 1024 * 1024) {
      alert('File size must be less than 10MB.');
      return;
    }

    alert('Bank account details submitted!');
    console.log('Submitted:', { ...formData, bankStatementFile: formData.bankStatementFile?.name });

    setFormData({
      bankName: '',
      accountNumber: '',
      ifscCode: '',
      accountType: '',
      bankStatementFile: null,
    });

    // Optionally go back: navigate(-1);
  };

  return (
    <Container>
      <BackButton />
      <Title>Bank Accounts</Title>
      <form onSubmit={handleSubmit} autoComplete="off">
        <Label htmlFor="bankName">Bank Name</Label>
        <Input
          id="bankName"
          name="bankName"
          type="text"
          value={formData.bankName}
          onChange={handleChange}
          placeholder="e.g. State Bank of India"
          required
        />
        <Label htmlFor="accountNumber">Account Number</Label>
        <Input
          id="accountNumber"
          name="accountNumber"
          type="text"
          value={formData.accountNumber}
          onChange={handleChange}
          placeholder="Enter account number"
          required
        />
        <Label htmlFor="ifscCode">IFSC Code</Label>
        <Input
          id="ifscCode"
          name="ifscCode"
          type="text"
          value={formData.ifscCode}
          onChange={handleChange}
          placeholder="e.g. SBIN0000123"
          required
        />
        <Label htmlFor="accountType">Account Type</Label>
        <Input
          id="accountType"
          name="accountType"
          type="text"
          value={formData.accountType}
          onChange={handleChange}
          placeholder="Savings / Current"
          required
        />
        <Label htmlFor="bankStatementFile">Upload Latest Bank Statement (PDF/Image, max 10MB)</Label>
        <Input
          id="bankStatementFile"
          name="bankStatementFile"
          type="file"
          accept="application/pdf,image/*"
          onChange={handleFileChange}
        />
        <Button type="submit">Save Bank Account</Button>
      </form>
    </Container>
  );
};

export default BankAccounts;
