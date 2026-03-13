import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const API_URL = process.env.REACT_APP_API_URL;

const Content = styled.div`
  flex: 1;
  background: #f4f4f8;
  padding: 2rem;
  overflow-y: auto;
`;

const Heading = styled.h2`
  font-size: 24px;
  margin-bottom: 1.5rem;
`;

const Form = styled.form`
  background: white;
  padding: 1.5rem;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  margin-bottom: 2rem;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 600;
`;

const Input = styled.input`
  width: 100%;
  padding: 0.6rem;
  margin-bottom: 1rem;
  border: 1px solid #ccc;
  border-radius: 8px;
`;

const Button = styled.button`
  background: ${props => props.danger ? '#ef4444' : props.success ? '#22c55e' : '#3b82f6'};
  color: white;
  padding: 0.6rem 1rem;
  margin-right: 0.5rem;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-weight: bold;
  &:hover { opacity: 0.9; }
  &:disabled { opacity: 0.5; cursor: not-allowed; }
`;

const List = styled.ul`
  list-style: none;
  padding: 0;
`;

const BeneficiaryCard = styled.li`
  background: white;
  padding: 1rem;
  border-radius: 10px;
  margin-bottom: 1rem;
  box-shadow: 0 1px 6px rgba(0,0,0,0.1);
`;

const AlarmWrapper = styled.div`
  background: white;
  padding: 1.5rem;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  margin-top: 2rem;
`;

const TimerInput = styled.input`
  padding: 0.5rem;
  width: 75px;
  border: 1px solid #ccc;
  border-radius: 8px;
  text-align: center;
  font-size: 1rem;
`;

const TimerLabel = styled.p`
  margin: 0 0 4px 0;
  font-size: 0.8rem;
  color: #666;
  font-weight: 600;
  text-align: center;
`;

const ClockFace = styled.div`
  width: 110px;
  height: 110px;
  border: 5px solid #ddd;
  border-radius: 50%;
  position: relative;
  margin: 20px auto;
  background: white;
`;

const Hand = styled.div`
  position: absolute;
  width: 2px;
  height: ${props => props.length || '35px'};
  background: ${props => props.color || '#333'};
  top: 50%;
  left: 50%;
  transform-origin: bottom;
  transform: translate(-50%, -100%) rotate(${props => props.rotate}deg);
  transition: transform 0.5s linear;
`;

const CenterDot = styled.div`
  width: 8px;
  height: 8px;
  background: #333;
  border-radius: 50%;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
`;

const StatusBadge = styled.span`
  background: ${props => props.active ? '#22c55e' : '#94a3b8'};
  color: white;
  padding: 0.2rem 0.7rem;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: bold;
  margin-left: 1rem;
`;

const ITEMS_PER_PAGE = 3;

const Beneficiaries = () => {
  const [beneficiaries, setBeneficiaries] = useState([]);
  const [formData, setFormData] = useState({ name: '', relation: '', contact: '', email: '' });
  const [editingId, setEditingId] = useState(null);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);

  const [inactivityDays, setInactivityDays] = useState('');
  const [inactivityHours, setInactivityHours] = useState('');
  const [inactivityMinutes, setInactivityMinutes] = useState('');
  const [savedLabel, setSavedLabel] = useState(null);
  const [timeLeft, setTimeLeft] = useState(0);
  const [timerLoading, setTimerLoading] = useState(false);

  const token = localStorage.getItem('authToken');

  const getUserId = () => {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.id || payload._id || payload.userId || 'user';
    } catch { return 'user'; }
  };

  const headers = { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` };
  const totalPages = Math.ceil(beneficiaries.length / ITEMS_PER_PAGE);

  useEffect(() => {
    fetchBeneficiaries();
    fetchInactivitySettings();
  }, []);

  useEffect(() => {
    const userId = getUserId();
    const savedEnd = localStorage.getItem(`alarmEnd_${userId}`);
    if (savedEnd) {
      const diff = Math.floor((savedEnd - Date.now()) / 1000);
      if (diff > 0) setTimeLeft(diff);
      else localStorage.removeItem(`alarmEnd_${userId}`);
    }
  }, []);

  useEffect(() => {
    if (timeLeft <= 0) return;
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          const userId = getUserId();
          localStorage.removeItem(`alarmEnd_${userId}`);
          toast.info('⏰ Inactivity timer ended! Notifying beneficiaries...');
          triggerInactivityEmail();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [timeLeft]);

  const triggerInactivityEmail = async () => {
    try {
      await fetch(`${API_URL}/api/inactivity-settings/trigger-email`, {
        method: 'POST',
        headers
      });
    } catch (err) {
      console.error('Failed to trigger inactivity email', err);
    }
  };

  const fetchBeneficiaries = async () => {
    try {
      const res = await fetch(`${API_URL}/api/beneficiaries`, { headers });
      const data = await res.json();
      if (res.ok) setBeneficiaries(data);
    } catch (err) {
      toast.error('Failed to load beneficiaries');
    }
  };

  // ✅ FIXED: only restores if user actually set a timer (inactivityMinutes > 0)
  const fetchInactivitySettings = async () => {
    try {
      const res = await fetch(`${API_URL}/api/inactivity-settings`, { headers });
      const data = await res.json();

      if (res.ok && data.inactivityMinutes && data.inactivityMinutes > 0) {
        const total = data.inactivityMinutes;
        const d = Math.floor(total / (24 * 60));
        const h = Math.floor((total % (24 * 60)) / 60);
        const m = total % 60;
        setInactivityDays(d > 0 ? String(d) : '');
        setInactivityHours(h > 0 ? String(h) : '');
        setInactivityMinutes(m > 0 ? String(m) : '');
        setSavedLabel(buildLabel(d, h, m));
      }
      // ✅ If null or 0 — user hasn't set a timer yet, show nothing
    } catch (err) {
      console.error('Failed to fetch inactivity settings');
    }
  };

  const buildLabel = (d, h, m) => {
    const parts = [];
    if (d > 0) parts.push(`${d}d`);
    if (h > 0) parts.push(`${h}h`);
    if (m > 0) parts.push(`${m}m`);
    return parts.join(' ') || '0';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.relation || !formData.contact) {
      toast.error('Please fill all fields');
      return;
    }
    if (!/^\d{10}$/.test(formData.contact)) {
      toast.error('Contact must be exactly 10 digits');
      return;
    }
    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      toast.error('Please enter a valid email');
      return;
    }
    setLoading(true);
    try {
      let res;
      if (editingId) {
        res = await fetch(`${API_URL}/api/beneficiaries/${editingId}`, {
          method: 'PUT', headers, body: JSON.stringify(formData)
        });
      } else {
        res = await fetch(`${API_URL}/api/beneficiaries`, {
          method: 'POST', headers, body: JSON.stringify(formData)
        });
      }
      if (res.ok) {
        toast.success(editingId ? 'Updated!' : 'Beneficiary added!');
        setFormData({ name: '', relation: '', contact: '', email: '' });
        setEditingId(null);
        fetchBeneficiaries();
      } else {
        const data = await res.json();
        toast.error(data.error || 'Failed to save');
      }
    } catch (err) {
      toast.error('Network error');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      const res = await fetch(`${API_URL}/api/beneficiaries/${id}`, {
        method: 'DELETE', headers
      });
      if (res.ok) { toast.info('Deleted'); fetchBeneficiaries(); }
    } catch (err) {
      toast.error('Failed to delete');
    }
  };

  const handleEdit = (b) => {
    setFormData({ name: b.name, relation: b.relation, contact: b.contact, email: b.email });
    setEditingId(b._id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSaveTimer = async () => {
    const d = parseInt(inactivityDays) || 0;
    const h = parseInt(inactivityHours) || 0;
    const m = parseInt(inactivityMinutes) || 0;

    const totalMinutes = (d * 24 * 60) + (h * 60) + m;

    if (totalMinutes < 1) {
      toast.error('Minimum timer is 1 minute');
      return;
    }
    if (h > 23) { toast.error('Hours must be 0–23'); return; }
    if (m > 59) { toast.error('Minutes must be 0–59'); return; }

    setTimerLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/inactivity-settings`, {
        method: 'POST',
        headers,
        body: JSON.stringify({ inactivityMinutes: totalMinutes })
      });

      const data = await res.json();

      if (res.ok) {
        const label = buildLabel(d, h, m);
        setSavedLabel(label);
        const userId = getUserId();
        const totalSeconds = totalMinutes * 60;
        const endTime = Date.now() + totalSeconds * 1000;
        localStorage.setItem(`alarmEnd_${userId}`, endTime);
        setTimeLeft(totalSeconds);
        toast.success(`✅ Timer set for ${label}! Beneficiaries will be emailed if you are inactive.`);
      } else {
        toast.error(data.error || 'Failed to save timer');
      }
    } catch (err) {
      toast.error('Network error');
    } finally {
      setTimerLoading(false);
    }
  };

  const handleStopTimer = () => {
    const userId = getUserId();
    localStorage.removeItem(`alarmEnd_${userId}`);
    setTimeLeft(0);
    setSavedLabel(null);
    toast.info('Timer stopped');
  };

  const formatTime = (sec) => {
    const d = Math.floor(sec / (3600 * 24));
    const h = Math.floor((sec % (3600 * 24)) / 3600);
    const m = Math.floor((sec % 3600) / 60);
    const s = sec % 60;
    const parts = [];
    if (d > 0) parts.push(`${d}d`);
    if (h > 0) parts.push(`${h}h`);
    if (m > 0) parts.push(`${m}m`);
    parts.push(`${s}s`);
    return parts.join(' ');
  };

  const getClockRotation = () => {
    const seconds = timeLeft % 60;
    const mins = Math.floor((timeLeft % 3600) / 60);
    const hrs = Math.floor((timeLeft % (3600 * 24)) / 3600);
    return {
      secDeg: seconds * 6,
      minDeg: mins * 6,
      hourDeg: hrs * 30
    };
  };

  const { secDeg, minDeg, hourDeg } = getClockRotation();

  const paginatedItems = beneficiaries.slice(
    (page - 1) * ITEMS_PER_PAGE,
    page * ITEMS_PER_PAGE
  );

  return (
    <Content>
      <Heading>{editingId ? 'Edit Beneficiary' : 'Add a Beneficiary'}</Heading>

      <Form onSubmit={handleSubmit}>
        <Label>Name</Label>
        <Input
          name="name"
          value={formData.name}
          onChange={e => setFormData(prev => ({ ...prev, name: e.target.value.replace(/[0-9]/g, '') }))}
          placeholder="Full name"
        />
        <Label>Relation</Label>
        <Input
          name="relation"
          value={formData.relation}
          onChange={e => setFormData(prev => ({ ...prev, relation: e.target.value.replace(/[0-9]/g, '') }))}
          placeholder="e.g. Son, Daughter, Spouse"
        />
        <Label>Contact Number</Label>
        <Input
          name="contact"
          value={formData.contact}
          onChange={e => setFormData(prev => ({ ...prev, contact: e.target.value }))}
          maxLength={10}
          placeholder="10 digit number"
        />
        <Label>Email Address</Label>
        <Input
          name="email"
          type="email"
          value={formData.email}
          onChange={e => setFormData(prev => ({ ...prev, email: e.target.value }))}
          placeholder="beneficiary@email.com"
        />
        <Button type="submit" disabled={loading}>
          {loading ? 'Saving...' : editingId ? 'Update' : 'Add Beneficiary'}
        </Button>
        {editingId && (
          <Button danger type="button" onClick={() => {
            setEditingId(null);
            setFormData({ name: '', relation: '', contact: '', email: '' });
          }}>Cancel</Button>
        )}
      </Form>

      <Heading>Saved Beneficiaries ({beneficiaries.length})</Heading>
      {beneficiaries.length === 0 && <p style={{ color: '#888' }}>No beneficiaries added yet.</p>}

      <List>
        {paginatedItems.map((b) => (
          <BeneficiaryCard key={b._id}>
            <p><strong>Name:</strong> {b.name}</p>
            <p><strong>Relation:</strong> {b.relation}</p>
            <p><strong>Contact:</strong> {b.contact}</p>
            <p><strong>Email:</strong> {b.email || 'Not provided'}</p>
            <Button onClick={() => handleEdit(b)}>Edit</Button>
            <Button danger onClick={() => handleDelete(b._id)}>Delete</Button>
          </BeneficiaryCard>
        ))}
      </List>

      {totalPages > 1 && (
        <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
          <Button onClick={() => setPage(p => Math.max(p - 1, 1))} disabled={page === 1}>Previous</Button>
          <span style={{ padding: '0.5rem' }}>Page {page} of {totalPages}</span>
          <Button onClick={() => setPage(p => Math.min(p + 1, totalPages))} disabled={page === totalPages}>Next</Button>
        </div>
      )}

      <AlarmWrapper>
        <Heading style={{ marginBottom: '0.5rem' }}>
          Inactivity Reminder
          {savedLabel && <StatusBadge active>Active: {savedLabel}</StatusBadge>}
        </Heading>

        <p style={{ color: '#666', marginBottom: '1.5rem' }}>
          If you are inactive for this long, all your beneficiaries will automatically receive an email. Minimum is 1 minute.
        </p>

        <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap' }}>
          <div>
            <TimerLabel>Days</TimerLabel>
            <TimerInput
              type="number"
              min="0"
              placeholder="0"
              value={inactivityDays}
              onChange={e => setInactivityDays(e.target.value)}
            />
          </div>
          <div>
            <TimerLabel>Hours (0–23)</TimerLabel>
            <TimerInput
              type="number"
              min="0"
              max="23"
              placeholder="0"
              value={inactivityHours}
              onChange={e => setInactivityHours(e.target.value)}
            />
          </div>
          <div>
            <TimerLabel>Minutes (0–59)</TimerLabel>
            <TimerInput
              type="number"
              min="0"
              max="59"
              placeholder="0"
              value={inactivityMinutes}
              onChange={e => setInactivityMinutes(e.target.value)}
            />
          </div>
        </div>

        <div style={{ marginTop: '1.2rem' }}>
          <Button onClick={handleSaveTimer} disabled={timerLoading} success>
            {timerLoading ? 'Saving...' : '✅ Set Inactivity Timer'}
          </Button>
          {timeLeft > 0 && (
            <Button danger onClick={handleStopTimer}>Stop Timer</Button>
          )}
        </div>

        {timeLeft > 0 && (
          <>
            <ClockFace>
              <Hand rotate={hourDeg} length="25px" />
              <Hand rotate={minDeg} length="35px" color="#2563eb" />
              <Hand rotate={secDeg} length="45px" color="#ef4444" />
              <CenterDot />
            </ClockFace>
            <p style={{ textAlign: 'center', fontWeight: 'bold', fontSize: '1.1rem' }}>
              {formatTime(timeLeft)} remaining
            </p>
          </>
        )}
      </AlarmWrapper>

      <ToastContainer position="bottom-right" autoClose={2000} />
    </Content>
  );
};

export default Beneficiaries;