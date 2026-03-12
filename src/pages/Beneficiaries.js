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

  &:hover {
    opacity: 0.9;
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
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
  margin: 0.3rem;
  width: 100px;
  border: 1px solid #ccc;
  border-radius: 8px;
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

  // Timer states
  const [inactivityDays, setInactivityDays] = useState('');
  const [savedDays, setSavedDays] = useState(null);
  const [timeLeft, setTimeLeft] = useState(0);
  const [timerLoading, setTimerLoading] = useState(false);

  const token = localStorage.getItem('authToken');
  const headers = { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` };

  const totalPages = Math.ceil(beneficiaries.length / ITEMS_PER_PAGE);

  // ── Load beneficiaries and inactivity settings on mount
  useEffect(() => {
    fetchBeneficiaries();
    fetchInactivitySettings();
  }, []);

  // ── Countdown clock
  useEffect(() => {
    const savedEnd = localStorage.getItem('alarmEnd');
    if (savedEnd) {
      const diff = Math.floor((savedEnd - Date.now()) / 1000);
      if (diff > 0) setTimeLeft(diff);
    }
  }, []);

  useEffect(() => {
    if (timeLeft <= 0) return;
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          localStorage.removeItem('alarmEnd');
          toast.info('⏰ Timer ended!');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [timeLeft]);

  // ── Fetch beneficiaries from MongoDB
  const fetchBeneficiaries = async () => {
    try {
      const res = await fetch(`${API_URL}/api/beneficiaries`, { headers });
      const data = await res.json();
      if (res.ok) setBeneficiaries(data);
    } catch (err) {
      toast.error('Failed to load beneficiaries');
    }
  };

  // ── Fetch saved inactivity days
  const fetchInactivitySettings = async () => {
    try {
      const res = await fetch(`${API_URL}/api/inactivity-settings`, { headers });
      const data = await res.json();
      if (res.ok && data.inactivityDays) {
        setSavedDays(data.inactivityDays);
        setInactivityDays(data.inactivityDays);
      }
    } catch (err) {
      console.error('Failed to fetch inactivity settings');
    }
  };

  // ── Add or update beneficiary
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
        // Update existing
        res = await fetch(`${API_URL}/api/beneficiaries/${editingId}`, {
          method: 'PUT',
          headers,
          body: JSON.stringify(formData)
        });
      } else {
        // Add new
        res = await fetch(`${API_URL}/api/beneficiaries`, {
          method: 'POST',
          headers,
          body: JSON.stringify(formData)
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

  // ── Delete beneficiary
  const handleDelete = async (id) => {
    try {
      const res = await fetch(`${API_URL}/api/beneficiaries/${id}`, {
        method: 'DELETE',
        headers
      });

      if (res.ok) {
        toast.info('Deleted');
        fetchBeneficiaries();
      }
    } catch (err) {
      toast.error('Failed to delete');
    }
  };

  // ── Edit beneficiary
  const handleEdit = (b) => {
    setFormData({ name: b.name, relation: b.relation, contact: b.contact, email: b.email });
    setEditingId(b._id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // ── Save inactivity timer
  const handleSaveTimer = async () => {
    if (!inactivityDays || inactivityDays < 1) {
      toast.error('Enter valid number of days');
      return;
    }

    setTimerLoading(true);

    try {
      const res = await fetch(`${API_URL}/api/inactivity-settings`, {
        method: 'POST',
        headers,
        body: JSON.stringify({ inactivityDays: parseInt(inactivityDays) })
      });

      const data = await res.json();

      if (res.ok) {
        setSavedDays(parseInt(inactivityDays));
        // Start visual countdown
        const totalSeconds = parseInt(inactivityDays) * 24 * 3600;
        const endTime = Date.now() + totalSeconds * 1000;
        localStorage.setItem('alarmEnd', endTime);
        setTimeLeft(totalSeconds);
        toast.success(`✅ Timer set! Beneficiaries will be emailed if you are inactive for ${inactivityDays} days`);
      } else {
        toast.error(data.error || 'Failed to save timer');
      }

    } catch (err) {
      toast.error('Network error');
    } finally {
      setTimerLoading(false);
    }
  };

  // ── Stop timer
  const handleStopTimer = async () => {
    localStorage.removeItem('alarmEnd');
    setTimeLeft(0);
    toast.info('Timer stopped');
  };

  const formatTime = (sec) => {
    const d = Math.floor(sec / (3600 * 24));
    const h = Math.floor((sec % (3600 * 24)) / 3600);
    const m = Math.floor((sec % 3600) / 60);
    return `${d}d ${h}h ${m}m`;
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

      {/* ── ADD / EDIT FORM ── */}
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
          }}>
            Cancel
          </Button>
        )}
      </Form>

      {/* ── BENEFICIARIES LIST ── */}
      <Heading>Saved Beneficiaries ({beneficiaries.length})</Heading>

      {beneficiaries.length === 0 && (
        <p style={{ color: '#888' }}>No beneficiaries added yet.</p>
      )}

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

      {/* ── INACTIVITY TIMER ── */}
      <AlarmWrapper>
        <Heading style={{ marginBottom: '0.5rem' }}>
          Inactivity Reminder
          {savedDays && <StatusBadge active>Active: {savedDays} days</StatusBadge>}
        </Heading>

        <p style={{ color: '#666', marginBottom: '1rem' }}>
          If you don't login for this many days, all your beneficiaries will automatically receive an email to check on you.
        </p>

        <Label>Number of Inactivity Days</Label>
        <TimerInput
          type="number"
          min="1"
          placeholder="e.g. 30"
          value={inactivityDays}
          onChange={e => setInactivityDays(e.target.value)}
        />

        <div style={{ marginTop: '1rem' }}>
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