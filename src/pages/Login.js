import React, { useState } from "react";
import styled, { keyframes } from "styled-components";
import { useNavigate, Link } from "react-router-dom";

const API_URL = process.env.REACT_APP_API_URL;

const fadeIn = keyframes`
  from {opacity: 0;}
  to {opacity: 1;}
`;

const Nav = styled.div`
  display: flex;
  align-items: center;
  padding: 22px 80px;
  background: #232b38;
  position: sticky;
  top: 0;
  z-index: 10;
  box-shadow: 0 2px 10px rgba(0,0,0,0.05);
`;

const Logo = styled(Link)`
  font-family: 'Playfair Display', serif;
  font-size: 2.2rem;
  font-weight: 900;
  text-decoration: none;
  letter-spacing: 1px;
`;

const LogoYellow = styled.span`
  color: #ffc107;
`;

const LogoBlue = styled.span`
  color: #2990fc;
`;

const LoginWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: calc(100vh - 73px);
  background: #232b38;
`;

const LoginBox = styled.div`
  background: white;
  padding: 3rem 3.6rem;
  border-radius: 14px;
  box-shadow: 0 14px 40px rgba(0,0,0,0.3);
  width: 360px;
`;

const Title = styled.h2`
  margin-bottom: 1.3rem;
  text-align: center;
  color: #2990fc;
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
  box-sizing: border-box;

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
  background: #2990fc;
  color: #ffffff;
  font-weight: 700;
  font-size: 1.1rem;
  border: none;
  border-radius: 12px;
  cursor: pointer;
  position: relative;

  &:hover:not(:disabled) {
    background: #1d68d1;
    box-shadow: 0 0 16px #1d68d1aa;
  }

  &:disabled {
    cursor: not-allowed;
    opacity: 0.6;
    background: #6995fc;
  }
`;

const Spinner = styled.div`
  border: 3.6px solid #ffffff44;
  border-top: 3.6px solid #ffffff;
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
  color: #2990fc;
  font-weight: 600;
  margin-left: 6px;
  text-decoration: underline;

  &:hover {
    color: #1d68d1;
  }
`;

// --- New styled components for the password wrapper ---

const PasswordWrapper = styled.div`
  position: relative;
  margin-bottom: 1.3rem;
`;

const PasswordInput = styled(Input)`
  margin-bottom: 0;           /* wrapper handles the bottom margin */
  padding-right: 3rem;        /* room for the eye icon */
`;

const EyeToggle = styled.button`
  position: absolute;
  right: 0.9rem;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  cursor: pointer;
  padding: 0;
  display: flex;
  align-items: center;
  color: #6b7a99;

  &:hover {
    color: #2990fc;
  }

  &:disabled {
    cursor: not-allowed;
    opacity: 0.4;
  }
`;

// Simple SVG eye icons
const EyeIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
);

const EyeOffIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
    <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
    <line x1="1" y1="1" x2="23" y2="23" />
  </svg>
);

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [errorMsg, setErrorMsg] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false); // 👁️ new state

  const passwordStrongEnough = (pwd) =>
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/.test(pwd);

  const handleChange = (e) =>
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleLogin = async () => {
    setErrorMsg("");

    if (!passwordStrongEnough(formData.password)) {
      setErrorMsg("Password must be at least 8 characters including uppercase, lowercase, and a number.");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch(`${API_URL}/api/auth/login`, {
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
    <>
      <Nav>
        <Logo to="/">
          <LogoYellow>Keep</LogoYellow>
          <LogoBlue>Legacy</LogoBlue>
        </Logo>
      </Nav>

      <LoginWrapper>
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
            <PasswordWrapper>
              <PasswordInput
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                value={formData.password || ""}
                onChange={handleChange}
                required
                disabled={loading}
                autoComplete="new-password"
              />
              <EyeToggle
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                disabled={loading}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOffIcon /> : <EyeIcon />}
              </EyeToggle>
            </PasswordWrapper>

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
    </>
  );
};

export default Login;
