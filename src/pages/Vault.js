import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';

const API_URL = process.env.REACT_APP_API_URL;

const Container = styled.div`
  padding: 2rem;
  background: #f4f4f8;
  min-height: 100vh;
`;

const Title = styled.h2`
  font-size: 1.8rem;
  font-weight: bold;
  margin-bottom: 0.5rem;
  color: #24305e;
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: 1.5rem;
  margin-top: 1.5rem;
`;

const VaultCard = styled(Link)`
  background: white;
  padding: 1.5rem;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.08);
  text-decoration: none;
  color: inherit;
  display: block;
  transition: 0.2s;
  &:hover { transform: translateY(-3px); box-shadow: 0 6px 16px rgba(0,0,0,0.12); }
`;

const CardIcon = styled.div`font-size: 2rem; margin-bottom: 0.5rem;`;
const CardTitle = styled.h3`font-size: 1rem; font-weight: 600; color: #24305e; margin-bottom: 0.3rem;`;
const CardInfo = styled.p`font-size: 0.85rem; color: #666;`;

const Loading = styled.p`color: #888; margin-top: 2rem;`;

const Vault = () => {
  const [summary, setSummary] = useState({});
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem('authToken');

  useEffect(() => {
    const fetchSummary = async () => {
      try {
        const res = await fetch(`${API_URL}/api/dashboard/summary`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (res.ok) setSummary(data);
      } catch (err) {
        console.error('Failed to load vault summary');
      } finally {
        setLoading(false);
      }
    };
    fetchSummary();
  }, []);

  const vaultItems = [
    { icon: '🏦', title: 'Bank Accounts', info: `${summary.bankAccountsCount || 0} Linked Banks`, path: '/bankaccounts' },
    { icon: '📄', title: 'Insurance', info: `${summary.insuranceTypes || 0} Policies`, path: '/insurance' },
    { icon: '📁', title: 'Personal Docs', info: `${summary.personalDocsCount || 0} Documents`, path: '/personaldocs' },
    { icon: '💹', title: 'Investments', info: summary.investmentsSummary || 'No Data', path: '/investments' },
    { icon: '🏡', title: 'Property Info', info: `${summary.propertyCount || 0} Properties`, path: '/propertyinfo' },
    { icon: '🧒', title: 'Children Plans', info: `${summary.childrenPlansCount || 0} Plans`, path: '/childrenplans' },
    { icon: '📊', title: 'Tax Details', info: summary.taxDetailsSummary || 'No Data', path: '/taxdetails' },
    { icon: '🪪', title: 'Ration Card', info: `${summary.rationCardMembers || 0} Members`, path: '/rationcard' },
    { icon: '💳', title: 'CIBIL Score', info: summary.cibilScoreStatus || 'Unavailable', path: '/cibilscore' },
    { icon: '📈', title: 'Portfolio', info: summary.consolidatedPortfolioSummary || 'No Data', path: '/consolidatedportfolio' },
  ];

  if (loading) return <Loading>Loading vault...</Loading>;

  return (
    <Container>
      <Title>🔐 Your Vault</Title>
      <p style={{ color: '#666' }}>All your important documents and financial information in one place.</p>

      <Grid>
        {vaultItems.map((item, i) => (
          <VaultCard key={i} to={item.path}>
            <CardIcon>{item.icon}</CardIcon>
            <CardTitle>{item.title}</CardTitle>
            <CardInfo>{item.info}</CardInfo>
          </VaultCard>
        ))}
      </Grid>
    </Container>
  );
};

export default Vault;