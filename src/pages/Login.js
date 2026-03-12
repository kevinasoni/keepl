import React, { useState } from "react";
import styled, { keyframes } from "styled-components";
import { useNavigate, Link } from "react-router-dom";

/* Clickable Logo */
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

/* Background */
const LoginWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  background: linear-gradient(135deg, #1164e8, #58b6f8, #f8e186);
`;

const floatCard = keyframes`
  0%, 100% { transform: translateY(0);}
  50% { transform: translateY(-16px);}
`;

const fadeIn = keyframes`
  from {opacity: 0;}
  to {opacity: 1;}
`;

const LoginBox = styled.div`
  background: white;
  padding: 3rem 3.6rem;
  border-radius: 14px;
  box-shadow: 0 14px 40px rgba(17, 100, 232, 0.22);
  width: 360px;
  animation: ${floatCard} 4.3s ease-in-out infinite;
`;

const Title = styled.h2`
  margin-bottom: 1.3rem;
  text-align: center;
  color: #1164e8;
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
    border-color: #1164e8;
    box-shadow: 0 0 10px #1164e8aa;
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
  background: #1164e8;
  color: #f8e186;
  font-weight: 700;
  font-size: 1.1rem;
  border: none;
  border-radius: 12px;
  cursor: pointer;
  position: relative;

  &:hover:not(:disabled) {
    background: #0b44b1;
    box-shadow: 0 0 16px #0b44b1aa;
  }

  &:disabled {
    cursor: not-allowed;
    opacity: 0.6;
    background: #6995fc;
  }
`;

const Spinner = styled.div`
  border: 3.6px solid #f8e18644;
  border-top: 3.6px solid #f8e186;
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
  color: #ef3e36;
  font-weight: 600;
  text-align: center;
  animation: ${fadeIn} 0.3s ease;
`;

const NoAccount = styled.p`
  margin-top: 1.6rem;
  text-align: center;
  color: #333;
  font-size: 0.95rem;
`;

const RegisterLink = styled(Link)`
  color: #1164e8;
  font-weight: 600;
  margin-left: 6px;
  text-decoration: underline;

  &:hover {
    color: #0b44b1;
  }
`;

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [errorMsg, setErrorMsg] = useState("");
  const [loading, setLoading] = useState(false);

  const passwordStrongEnough = (pwd) => {
    return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/.test(pwd);
  };

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleLogin = async () => {
    setErrorMsg("");

    if (!passwordStrongEnough(formData.password)) {
      setErrorMsg(
        "Password must be at least 8 characters including uppercase, lowercase, and a number."
      );
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        setErrorMsg(data.error || "Login failed");
        setLoading(false);
        return;
      }

      localStorage.setItem("authToken", data.token);
      setLoading(false);
      navigate("/Dashboard");

    } catch (error) {
      setErrorMsg("Network error: " + error.message);
      setLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!loading) handleLogin();
  };

  return (
    <LoginWrapper>

      {/* Clickable Logo */}
      <Logo to="/">KeepLegacy</Logo>

      <LoginBox>
        <Title>Login to KeepLegacy</Title>

        <form onSubmit={handleSubmit} autoComplete="new-password">

  <Label htmlFor="email">Email Address</Label>
  <Input
    id="email"
    name="email"
    type="email"
    placeholder="Email Address"
    value={formData.email || ""}
    onChange={handleChange}
    required
    disabled={loading}
    autoComplete="off"
  />

  <Label htmlFor="password">Password</Label>
  <Input
    id="password"
    name="password"
    type="password"
    placeholder="Password"
    value={formData.password || ""}
    onChange={handleChange}
    required
    disabled={loading}
    autoComplete="new-password"
  />

  <Button type="submit" disabled={loading}>
    {loading ? <Spinner /> : "Login"}
  </Button>

</form>
        {errorMsg && <Message>{errorMsg}</Message>}

        <NoAccount>
          Don't have an account?
          <RegisterLink to="/register">Register</RegisterLink>
        </NoAccount>

      </LoginBox>

    </LoginWrapper>
  );
};

export default Login;