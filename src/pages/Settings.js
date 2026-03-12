import React, { useState } from 'react';
import styled from 'styled-components';

const Container = styled.div`
  max-width: 700px;
  margin: auto;
  padding: 2rem;
  background: #fff;
  box-shadow: 0 0 8px rgba(0,0,0,0.1);
  border-radius: 8px;
`;

const Section = styled.section`
  margin-bottom: 2rem;
`;

const SectionTitle = styled.h2`
  margin-bottom: 1rem;
  border-bottom: 2px solid #2990fc;
  padding-bottom: 0.5rem;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 0.5rem;
  font-weight: bold;
`;

const Input = styled.input`
  padding: 0.5rem;
  width: 100%;
  margin-bottom: 1rem;
  border-radius: 4px;
  border: 1px solid #ccc;
`;

const ToggleLabel = styled.label`
  display: flex;
  align-items: center;
  cursor: pointer;
  margin-bottom: 1rem;
`;

const ToggleInput = styled.input`
  margin-right: 0.75rem;
`;

const Button = styled.button`
  background-color: #2990fc;
  color: white;
  border: none;
  padding: 0.7rem 1.2rem;
  border-radius: 4px;
  cursor: pointer;

  &:hover {
    background-color: #1a5fc1;
  }
`;

const Settings = () => {
  const [profile, setProfile] = useState({
    name: '',
    email: '',
  });

  const [security, setSecurity] = useState({
    twoFactorAuth: false,
    loginAlerts: false,
  });

  const [privacy, setPrivacy] = useState({
    profileVisibility: true,
    searchEngineIndexing: false,
  });

  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setProfile((prev) => ({ ...prev, [name]: value }));
  };

  const handleSecurityChange = (e) => {
    const { name, checked } = e.target;
    setSecurity((prev) => ({ ...prev, [name]: checked }));
  };

  const handlePrivacyChange = (e) => {
    const { name, checked } = e.target;
    setPrivacy((prev) => ({ ...prev, [name]: checked }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Here, handle saving settings to server or storage
    alert('Settings saved successfully!');
  };

  return (
    <Container>
      <h1>Settings</h1>
      <form onSubmit={handleSubmit}>
        {/* Profile Section */}
        <Section>
          <SectionTitle>Profile</SectionTitle>
          <Label htmlFor="name">Full Name</Label>
          <Input
            id="name"
            name="name"
            type="text"
            value={profile.name}
            onChange={handleProfileChange}
            placeholder="Your full name"
            required
          />
          <Label htmlFor="email">Email Address</Label>
          <Input
            id="email"
            name="email"
            type="email"
            value={profile.email}
            onChange={handleProfileChange}
            placeholder="your.email@example.com"
            required
          />
        </Section>

        {/* Security Section */}
        <Section>
          <SectionTitle>Security</SectionTitle>
          <ToggleLabel>
            <ToggleInput
              type="checkbox"
              name="twoFactorAuth"
              checked={security.twoFactorAuth}
              onChange={handleSecurityChange}
            />
            Enable Two-Factor Authentication (2FA)
          </ToggleLabel>
          <ToggleLabel>
            <ToggleInput
              type="checkbox"
              name="loginAlerts"
              checked={security.loginAlerts}
              onChange={handleSecurityChange}
            />
            Receive Login Alerts
          </ToggleLabel>
        </Section>

        {/* Privacy Section */}
        <Section>
          <SectionTitle>Privacy</SectionTitle>
          <ToggleLabel>
            <ToggleInput
              type="checkbox"
              name="profileVisibility"
              checked={privacy.profileVisibility}
              onChange={handlePrivacyChange}
            />
            Make Profile Public
          </ToggleLabel>
          <ToggleLabel>
            <ToggleInput
              type="checkbox"
              name="searchEngineIndexing"
              checked={privacy.searchEngineIndexing}
              onChange={handlePrivacyChange}
            />
            Allow Search Engines to Index My Profile
          </ToggleLabel>
        </Section>

        <Button type="submit">Save Settings</Button>
      </form>
    </Container>
  );
};

export default Settings;
