import React from 'react';
import styled from 'styled-components';

const Wrapper = styled.div`
  padding: 2rem;
  background: #f5f5f5;
  min-height: 100vh;
`;

const Title = styled.h1`
  font-size: 2rem;
  color: #222;
`;

const Description = styled.p`
  font-size: 1rem;
  color: #555;
`;

export default function HomePage() {
  return (
    <Wrapper>
      <Title>Welcome to KeepLegacy</Title>
      <Description>This UI is powered by styled-components!</Description>
    </Wrapper>
  );
}
