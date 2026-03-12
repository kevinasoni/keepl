
import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const PageContainer = styled.div`
  display: flex;
  height: 100vh;
`;

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
  background: ${props => props.danger ? '#ef4444' : '#3b82f6'};
  color: white;
  padding: 0.6rem 1rem;
  margin-right: 0.5rem;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-weight: bold;

  &:hover {
    background: ${props => props.danger ? '#dc2626' : '#2563eb'};
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

const PaginationControls = styled.div`
  display: flex;
  gap: 1rem;
  margin-top: 1rem;
`;

/* 🔥 TIMER STYLES */
const AlarmWrapper = styled.div`
  margin-top: 3rem;
  text-align: center;
`;

const TimerText = styled.h3`
  margin-top: 10px;
`;

const TimerInput = styled.input`
  padding: 0.5rem;
  margin: 0.3rem;
  width: 80px;
`;

/* 🔥 REAL CLOCK */
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

const ITEMS_PER_PAGE = 3;

const Beneficiaries = () => {
  const [beneficiaries, setBeneficiaries] = useState([]);
  const [formData, setFormData] = useState({ name: '', relation: '', contact: '', email: '' });
  const [editingIndex, setEditingIndex] = useState(null);
  const [page, setPage] = useState(1);

  /* 🔥 TIMER STATES */
  const [days, setDays] = useState('');
  const [hours, setHours] = useState('');
  const [minutes, setMinutes] = useState('');
  const [timeLeft, setTimeLeft] = useState(0);

  const totalPages = Math.ceil(beneficiaries.length / ITEMS_PER_PAGE);

  useEffect(() => {
    const savedEnd = localStorage.getItem("alarmEnd");
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
          localStorage.removeItem("alarmEnd");
          toast.info("⏰ Alarm Finished!");
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft]);

  const startAlarm = () => {
    const totalSeconds =
      (parseInt(days || 0) * 24 * 3600) +
      (parseInt(hours || 0) * 3600) +
      (parseInt(minutes || 0) * 60);

    if (totalSeconds <= 0) {
      return toast.error("Enter valid time");
    }

    const endTime = Date.now() + totalSeconds * 1000;
    localStorage.setItem("alarmEnd", endTime);
    setTimeLeft(totalSeconds);
    toast.success("⏰ Alarm Started!");
  };

  const stopAlarm = () => {
    localStorage.removeItem("alarmEnd");
    setTimeLeft(0);
    toast.info("Alarm Stopped");
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

  const handleChange = e => {
    const { name, value } = e.target;

    if (name === 'name' || name === 'relation') {
      const filteredValue = value.replace(/[0-9]/g, '');
      setFormData(prev => ({ ...prev, [name]: filteredValue }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = e => {
    e.preventDefault();

    if (!formData.name || !formData.relation || !formData.contact) {
      toast.error('Please fill all fields');
      return;
    }

    if (!/^\d{10}$/.test(formData.contact)) {
      toast.error('Contact must be exactly 10 digits');
      return;
    }

    if (editingIndex !== null) {
      const updated = [...beneficiaries];
      updated[editingIndex] = formData;
      setBeneficiaries(updated);
      setEditingIndex(null);
      toast.success('Updated!');
    } else {
      setBeneficiaries(prev => [...prev, formData]);
      toast.success('Added!');
    }

    setFormData({ name: '', relation: '', contact: '', email: '' });
  };

  const handleEdit = index => {
    setFormData(beneficiaries[index]);
    setEditingIndex(index);
  };

  const handleDelete = index => {
    const updated = [...beneficiaries];
    updated.splice(index, 1);
    setBeneficiaries(updated);
    toast.info('Deleted');
  };

  const paginatedItems = beneficiaries.slice(
    (page - 1) * ITEMS_PER_PAGE,
    page * ITEMS_PER_PAGE
  );

  return (
    <PageContainer>
      <Content>

        <Heading>{editingIndex !== null ? 'Edit Beneficiary' : 'Add a Beneficiary'}</Heading>

        <Form onSubmit={handleSubmit}>
          <Label>Name</Label>
          <Input name="name" value={formData.name} onChange={handleChange} />

          <Label>Relation</Label>
          <Input name="relation" value={formData.relation} onChange={handleChange} />

          <Label>Contact Info</Label>
          <Input name="contact" value={formData.contact} onChange={handleChange} maxLength={10} />

          <Label>Email-ID</Label>
          <Input name="email" value={formData.email} onChange={handleChange} />

          <Button type="submit">
            {editingIndex !== null ? 'Update' : 'Add'}
          </Button>
        </Form>

        <Heading>Saved Beneficiaries</Heading>

        <List>
          {paginatedItems.map((b, index) => (
            <BeneficiaryCard key={index}>
              <p><strong>Name:</strong> {b.name}</p>
              <p><strong>Relation:</strong> {b.relation}</p>
              <p><strong>Contact:</strong> {b.contact}</p>
              <p><strong>Email:</strong> {b.email}</p>

              <Button onClick={() => handleEdit(index)}>Edit</Button>
              <Button danger onClick={() => handleDelete(index)}>Delete</Button>
            </BeneficiaryCard>
          ))}
        </List>

        {/* 🔥 TIMER UI */}
        <AlarmWrapper>
          <Heading>Reminder Timer</Heading>

          <TimerInput type="number" placeholder="Days" value={days} onChange={(e) => setDays(e.target.value)} />
          <TimerInput type="number" placeholder="Hours" value={hours} onChange={(e) => setHours(e.target.value)} />
          <TimerInput type="number" placeholder="Mins" value={minutes} onChange={(e) => setMinutes(e.target.value)} />

          <div>
            <Button onClick={startAlarm}>Start</Button>
            <Button danger onClick={stopAlarm}>Stop</Button>
          </div>

          {timeLeft > 0 && (
            <>
              <ClockFace>
                <Hand rotate={hourDeg} length="25px" />
                <Hand rotate={minDeg} length="35px" color="#2563eb" />
                <Hand rotate={secDeg} length="45px" color="#ef4444" />
                <CenterDot />
              </ClockFace>

              <TimerText>{formatTime(timeLeft)}</TimerText>
            </>
          )}
        </AlarmWrapper>

        <ToastContainer position="bottom-right" autoClose={2000} />
      </Content>
    </PageContainer>
  );
};

export default Beneficiaries;