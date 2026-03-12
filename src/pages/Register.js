import React, { useState } from "react";
import styled, { keyframes } from "styled-components";
import { useNavigate, Link } from "react-router-dom";

const API_URL = process.env.REACT_APP_API_URL;

const Logo = styled(Link)`
  position: absolute;
  top: 30px;
  left: 40px;
  font-family: 'Playfair Display', serif;
  font-size: 2.2rem;
  font-weight: 900;
  color: white;
  text-decoration: none;
  letter-spacing: 1px;
`;

const floatCard = keyframes`
  0%, 100% { transform: translateY(0);}
  50% { transform: translateY(-16px);}
`;

const fadeIn = keyframes`
  from {opacity: 0;}
  to {opacity: 1;}
`;

const RegisterWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  background: linear-gradient(135deg, #2990fc, #5db0ff, #ffc107);
`;

const RegisterBox = styled.div`
  background: white;
  padding: 3rem 3.6rem;
  border-radius: 14px;
  box-shadow: 0 14px 40px rgba(41, 144, 252, 0.22);
  width: 360px;
  animation: ${floatCard} 4.3s ease-in-out infinite;
`;

const Title = styled.h2`
  margin-bottom: 1.3rem;
  text-align: center;
  color: #2990fc;
  font-weight: 700;
`;

const Label = styled.label`
  text-align: left;
  font-weight: 700;
  margin-bottom: 0.35rem;
  display: block;
  color: #222f56;
`;

const Input = styled.input`
  width: 100%;
  padding: 0.85rem 1.1rem;
  margin-bottom: 1.3rem;
  border-radius: 10px;
  border: 1.5px solid #aab7d1;
  font-size: 1rem;
  &:focus {
    border-color: #2990fc;
    box-shadow: 0 0 10px #2990fcaa;
    outline: none;
  }
  &:disabled {
    background: #e1e5ec;
    cursor: not-allowed;
  }
`;

const Button = styled.button`
  width: 100%;
  padding: 0.85rem;
  background: #ffc107;
  color: #174101;
  font-weight: 700;
  font-size: 1.1rem;
  border: none;
  border-radius: 12px;
  cursor: pointer;
  position: relative;
  &:hover:not(:disabled) {
    background: #ffb300;
    box-shadow: 0 0 16px #ffb300cc;
  }
  &:disabled {
    cursor: not-allowed;
    opacity: 0.6;
    background: #f9d81b;
  }
`;

const Spinner = styled.div`
  border: 3.6px solid #ffff88aa;
  border-top: 3.6px solid #ffff88;
  border-radius: 50%;
  width: 22px;
  height: 22px;
  animation: spin 0.75s linear infinite;
  position: absolute;
  top: 50%;
  left: 50%;
  margin-top: -11px;
  margin-left: -11px;
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

const Message = styled.p`
  margin-top: 1.2rem;
  color: ${(props) => (props.error ? "#d32f2f" : "#388e3c")};
  font-weight: 600;
  text-align: center;
  animation: ${fadeIn} 0.3s ease;
`;

const ExistingAccount = styled.p`
  margin-top: 1.6rem;
  text-align: center;
  color: #333;
  font-size: 0.95rem;
`;

const LoginLink = styled(Link)`
  color: #2990fc;
  font-weight: 600;
  margin-left: 6px;
  text-decoration: underline;
  &:hover { color: #1d68d1; }
`;

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ name: "", email: "", password: "" });
  const [message, setMessage] = useState("");
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);

  const passwordStrongEnough = (pwd) =>
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/.test(pwd);

  const handleChange = (e) =>
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError(false);

    if (!passwordStrongEnough(formData.password)) {
      setError(true);
      setMessage("Password must be at least 8 characters long, and include uppercase, lowercase letters, and a number.");
      return;
    }

    setLoading(true);

    try {
      // ✅ Register
      const res = await fetch(`${API_URL}/api/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(true);
        setMessage(data.error || "Registration failed.");
        setLoading(false);
        return;
      }

      // ✅ Auto-login after register
      const loginRes = await fetch(`${API_URL}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: formData.email, password: formData.password }),
      });

      const loginData = await loginRes.json();

      if (!loginRes.ok) {
        setError(true);
        setMessage("Registration succeeded but login failed. Please login manually.");
        setLoading(false);
        return;
      }

      localStorage.setItem("authToken", loginData.token);
      setMessage("Registration successful! Redirecting...");
      navigate("/dashboard");

    } catch (err) {
      setError(true);
      setMessage("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <RegisterWrapper>
      <Logo to="/">KeepLegacy</Logo>
      <RegisterBox>
        <Title>Create Your Account</Title>
        <form onSubmit={handleSubmit} autoComplete="new-password">
          <Label htmlFor="name">Full Name</Label>
          <Input id="name" name="name" type="text" placeholder="Full Name"
            value={formData.name} onChange={handleChange} required disabled={loading} autoComplete="off" />

          <Label htmlFor="email">Email Address</Label>
          <Input id="email" name="email" type="email" placeholder="Email Address"
            value={formData.email} onChange={handleChange} required disabled={loading} autoComplete="off" />

          <Label htmlFor="password">Password</Label>
          <Input id="password" name="password" type="password" placeholder="Password"
            value={formData.password} onChange={handleChange} required disabled={loading} autoComplete="new-password" />

          <Button type="submit" disabled={loading}>
            {loading ? <Spinner /> : "Register"}
          </Button>
        </form>

        {message && <Message error={error}>{message}</Message>}

        <ExistingAccount>
          Already have an account?
          <LoginLink to="/login">Login</LoginLink>
        </ExistingAccount>
      </RegisterBox>
    </RegisterWrapper>
  );
};

export default Register;