import React from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';

const Button = styled.button`
  background-color: transparent;
  border: none;
  color: #2990fc;
  font-size: 1rem;
  cursor: pointer;
  padding: 0;
  margin-bottom: 1rem;
  display: inline-flex;
  align-items: center;

  &:hover {
    text-decoration: underline;
  }
`;

const BackButton = ({ label = '← Back', style, className }) => {
  const navigate = useNavigate();

  return (
    <Button
      onClick={() => navigate(-1)}
      style={style}
      className={className}
      aria-label="Go back to previous page"
      type="button"
    >
      {label}
    </Button>
  );
};

export default BackButton;
