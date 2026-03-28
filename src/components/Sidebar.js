import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { FiLogOut } from 'react-icons/fi';
import { toast } from 'react-toastify';
import styled from 'styled-components';

/* ================= SIDEBAR STYLES ================= */

const SidebarContainer = styled.div`
  width: 260px;
  background: #232b38;
  color: white;
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
  min-height: 100vh;
  position: sticky;
  top: 0;
`;

const SidebarLogo = styled.div`
  font-size: 2em;
  font-weight: bold;
  padding: 24px 0 24px 24px;
  cursor: pointer;
`;

const LogoYellow = styled.span`
  color: #ffc107;
`;

const LogoBlue = styled.span`
  color: #2990fc;
`;

const Menu = styled.ul`
  list-style: none;
  padding-left: 24px;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const MenuBottom = styled(Menu)`
  margin-top: auto;
  border-top: 1px solid #444;
  padding-top: 16px;
`;

const MenuItem = styled.li`
  font-size: 1.1em;
  display: flex;
  align-items: center;
`;

const StyledNavLink = styled(NavLink)`
  color: #ffffff;
  text-decoration: none;
  width: 100%;
  padding: 10px 14px;
  border-radius: 6px;
  transition: all 0.3s ease;
  display: block;

  &:hover {
    background-color: #1e3a8a;
    color: #ffffff;
  }

  &.active {
    background-color: #ffffff;
    color: #0f172a;
    font-weight: 600;
  }
`;

const LogoutItem = styled(MenuItem)`
  cursor: pointer;
  color: #fff;
  padding: 10px 14px;
  border-radius: 6px;
  transition: all 0.3s ease;

  &:hover {
    background-color: #1e3a8a;
    color: #ffffff;
  }
`;

const LogoutIcon = styled(FiLogOut)`
  margin-right: 8px;
`;

const ConfirmBackdrop = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0,0,0,0.4);
  z-index: 2000;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const ConfirmDialogBox = styled.div`
  background: #fff;
  padding: 1.5rem 2rem;
  border-radius: 12px;
  max-width: 320px;
  text-align: center;
  box-shadow: 0 12px 40px rgba(0,0,0,0.2);
  font-size: 1rem;
  font-weight: 600;
`;

const ConfirmButtons = styled.div`
  margin-top: 1.2rem;
  display: flex;
  justify-content: center;
  gap: 1rem;
`;

const BtnConfirm = styled.button`
  padding: 0.5rem 2.5rem;
  border-radius: 8px;
  border: none;
  font-weight: 700;
  cursor: pointer;
  font-size: 1rem;
  background-color: #3b82f6;
  color: white;

  &:hover {
    background-color: #2563eb;
  }
`;

const BtnCancel = styled.button`
  padding: 0.5rem 2.5rem;
  border-radius: 8px;
  border: none;
  font-weight: 700;
  cursor: pointer;
  font-size: 1rem;
  background-color: #f3f4f6;
  color: #333;

  &:hover {
    background-color: #e5e7eb;
  }
`;

/* ================= CONFIRM DIALOG ================= */

const ConfirmDialog = ({ open, onClose, onConfirm, question }) => {
  if (!open) return null;
  return (
    <ConfirmBackdrop>
      <ConfirmDialogBox>
        <p>{question}</p>
        <ConfirmButtons>
          <BtnConfirm onClick={onConfirm}>Yes</BtnConfirm>
          <BtnCancel onClick={onClose}>No</BtnCancel>
        </ConfirmButtons>
      </ConfirmDialogBox>
    </ConfirmBackdrop>
  );
};

/* ================= SIDEBAR COMPONENT ================= */

const Sidebar = () => {
  const navigate = useNavigate();
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  const handleLogoutClick = () => {
    setShowLogoutConfirm(true);
  };

  const handleConfirmLogout = () => {
    setShowLogoutConfirm(false);
    localStorage.removeItem('authToken');
    toast.success('You have been logged out successfully!');
    setTimeout(() => {
      navigate('/');
    }, 500);
  };

  const handleCancelLogout = () => {
    setShowLogoutConfirm(false);
  };

  return (
    <>
      <SidebarContainer>

        {/* CLICKABLE LOGO */}
        <NavLink to="/dashboard" style={{ textDecoration: "none" }}>
          <SidebarLogo>
            <LogoYellow>Keep</LogoYellow>
            <LogoBlue>Legacy</LogoBlue>
          </SidebarLogo>
        </NavLink>

        <Menu>
          <MenuItem>
            <StyledNavLink to="/dashboard" end>Dashboard</StyledNavLink>
          </MenuItem>
          <MenuItem>
            <StyledNavLink to="/beneficiaries">Beneficiaries</StyledNavLink>
          </MenuItem>
          <MenuItem>
            <StyledNavLink to="/myfiles">MyFiles</StyledNavLink>
          </MenuItem>
          <MenuItem>
            <StyledNavLink to="/aiadvisor">AiAdvisor</StyledNavLink>
          </MenuItem>
          <MenuItem>
            <StyledNavLink to="/lifestyle">Lifestyle</StyledNavLink>
          </MenuItem>
        </Menu>

        <MenuBottom>
          <MenuItem>
            <StyledNavLink to="/settings">Settings</StyledNavLink>
          </MenuItem>
          <LogoutItem onClick={handleLogoutClick}>
            <LogoutIcon size={18} />
            Logout
          </LogoutItem>
        </MenuBottom>
      </SidebarContainer>

      <ConfirmDialog
        open={showLogoutConfirm}
        onClose={handleCancelLogout}
        onConfirm={handleConfirmLogout}
        question="Are you sure you want to log out?"
      />
    </>
  );
};

export default Sidebar;