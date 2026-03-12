import React from 'react';
import styled from 'styled-components';

const Card = styled.div`
  background: white;
  border-radius: 12px;
  padding: 1.5rem;
  width: 250px;
  box-shadow: 0 4px 8px rgba(0,0,0,0.08);
  transition: all 0.3s;
  cursor: pointer;

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 6px 12px rgba(0,0,0,0.12);
  }
`;

const Title = styled.h3`
  font-size: 1.1rem;
  margin-bottom: 0.5rem;
`;

const Info = styled.p`
  font-size: 0.9rem;
  color: #555;
`;

const DashboardCard = ({ title, info, icon }) => {
  return (
    <Card>
      <Title>{icon} {title}</Title>
      <Info>{info}</Info>
    </Card>
  );
};

export default DashboardCard;
