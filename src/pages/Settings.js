import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const API_URL = process.env.REACT_APP_API_URL;

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
  &:focus { outline: none; border-color: #2990fc; }
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
  background-color: ${props => props.danger ? '#ef4444' : '#2990fc'};
  color: white;
  border: none;
  padding: 0.7rem 1.2rem;
  border-radius: 4px;
  cursor: pointer;
  margin-right: 1rem;
  font-weight: bold;
  &:hover { opacity: 0.9; }
  &:disabled { opacity: 0.5; cursor: not-allowed; }
`;

const StatusBadge = styled.span`
  background: #22c55e;
  color: white;
  padding: 0.2rem 0.7rem;
  border-radius: 20px;
  font-size: 0.8rem;
  margin-left: 1rem;
`;

const Settings = () => {
  const [profile, setProfile] = useState({ name: '', email: '' });
  const [passwords, setPasswords] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const [loading, setLoading] = useState(false);
  const [profileLoaded, setProfileLoaded] = useState(false);

  const token = localStorage.getItem('authToken');
  const headers = { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` };

  // ✅ Load user profile on mount
  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const res = await fetch(`${API_URL}/api/auth/profile`, { headers });
      const data = await res.json();
      if (res.ok) {
        setProfile({ name: data.name || '', email: data.email || '' });
        setProfileLoaded(true);
      }
    } catch (err) {
      console.error('Failed to load profile');
    }
  };

  // ✅ Save profile changes
  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/auth/profile`, {
        method: 'PUT',
        headers,
        body: JSON.stringify({ name: profile.name }),
      });
      const data = await res.json();
      if (res.ok) {
        toast.success('Profile updated successfully!');
      } else {
        toast.error(data.error || 'Failed to update profile');
      }
    } catch (err) {
      toast.error('Network error');
    } finally {
      setLoading(false);
    }
  };

  // ✅ Change password
  const handlePasswordSubmit = async (e) => {
    e.preventDefault();

    if (passwords.newPassword !== passwords.confirmPassword) {
      toast.error('New passwords do not match');
      return;
    }

    if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/.test(passwords.newPassword)) {
      toast.error('Password must be 8+ characters with uppercase, lowercase and number');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/auth/change-password`, {
        method: 'PUT',
        headers,
        body: JSON.stringify({
          currentPassword: passwords.currentPassword,
          newPassword: passwords.newPassword,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        toast.success('Password changed successfully!');
        setPasswords({ currentPassword: '', newPassword: '', confirmPassword: '' });
      } else {
        toast.error(data.error || 'Failed to change password');
      }
    } catch (err) {
      toast.error('Network error');
    } finally {
      setLoading(false);
    }
  };

  // ✅ Delete account
  const handleDeleteAccount = async () => {
    if (!window.confirm('Are you sure you want to delete your account? This cannot be undone.')) return;

    try {
      const res = await fetch(`${API_URL}/api/auth/delete-account`, {
        method: 'DELETE',
        headers,
      });
      if (res.ok) {
        localStorage.removeItem('authToken');
        window.location.href = '/home';
      } else {
        toast.error('Failed to delete account');
      }
    } catch (err) {
      toast.error('Network error');
    }
  };

  return (
    <Container>
      <h1>Settings {profileLoaded && <StatusBadge>Loaded</StatusBadge>}</h1>

      {/* ── Profile Section ── */}
      <Section>
        <SectionTitle>Profile</SectionTitle>
        <form onSubmit={handleProfileSubmit}>
          <Label>Full Name</Label>
          <Input
            type="text"
            value={profile.name}
            onChange={e => setProfile(prev => ({ ...prev, name: e.target.value }))}
            placeholder="Your full name"
            required
          />
          <Label>Email Address</Label>
          <Input
            type="email"
            value={profile.email}
            disabled
            style={{ background: '#f1f5f9', color: '#888' }}
          />
          <p style={{ fontSize: '0.8rem', color: '#888', marginTop: '-0.8rem', marginBottom: '1rem' }}>
            Email cannot be changed
          </p>
          <Button type="submit" disabled={loading}>
            {loading ? 'Saving...' : 'Save Profile'}
          </Button>
        </form>
      </Section>

      {/* ── Change Password Section ── */}
      <Section>
        <SectionTitle>Change Password</SectionTitle>
        <form onSubmit={handlePasswordSubmit}>
          <Label>Current Password</Label>
          <Input
            type="password"
            value={passwords.currentPassword}
            onChange={e => setPasswords(prev => ({ ...prev, currentPassword: e.target.value }))}
            placeholder="Current password"
            required
          />
          <Label>New Password</Label>
          <Input
            type="password"
            value={passwords.newPassword}
            onChange={e => setPasswords(prev => ({ ...prev, newPassword: e.target.value }))}
            placeholder="New password (8+ chars, upper, lower, number)"
            required
          />
          <Label>Confirm New Password</Label>
          <Input
            type="password"
            value={passwords.confirmPassword}
            onChange={e => setPasswords(prev => ({ ...prev, confirmPassword: e.target.value }))}
            placeholder="Confirm new password"
            required
          />
          <Button type="submit" disabled={loading}>
            {loading ? 'Changing...' : 'Change Password'}
          </Button>
        </form>
      </Section>

      {/* ── Danger Zone ── */}
      <Section>
        <SectionTitle style={{ color: '#ef4444', borderColor: '#ef4444' }}>Danger Zone</SectionTitle>
        <p style={{ color: '#666', marginBottom: '1rem' }}>
          Deleting your account will permanently remove all your data including beneficiaries, medical info, and all saved records.
        </p>
        <Button danger onClick={handleDeleteAccount}>Delete My Account</Button>
      </Section>

      <ToastContainer position="bottom-right" autoClose={2000} />
    </Container>
  );
};

export default Settings;