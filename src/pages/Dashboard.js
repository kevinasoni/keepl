import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import DashboardCard from '../components/DashboardCard';
import { Link } from 'react-router-dom';

const API_URL = process.env.REACT_APP_API_URL;

const ContentArea = styled.div`
  background-color: #f9fafb;
  padding: 2rem;
  min-height: 100vh;
  overflow-y: auto;
`;

const Header = styled.div`
  font-size: 1.5rem;
  font-weight: bold;
  margin-bottom: 1rem;
`;

const CardsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: 1.5rem;

  a {
    color: inherit;
    text-decoration: none;
  }
`;

const Loading = styled.p`
  font-size: 1.2rem;
  margin-top: 2rem;
`;

const ErrorMsg = styled.p`
  color: red;
  margin-top: 2rem;
  font-weight: bold;
`;

const Dashboard = () => {
  const [data, setData] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchSummary = async () => {
      try {
        const token = localStorage.getItem('authToken');

        // ✅ FIXED: was localhost:5000
        const res = await fetch(`${API_URL}/api/dashboard/summary`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const text = await res.text();

        let result;
        try {
          result = JSON.parse(text);
        } catch {
          throw new Error("Backend not returning JSON (check server/URL)");
        }

        if (!res.ok) {
          throw new Error(result.error || "Failed to fetch");
        }

        setData(result);

      } catch (err) {
        console.error(err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchSummary();
  }, []);

  if (loading) return <Loading>Loading dashboard...</Loading>;
  if (error) return <ErrorMsg>Error: {error}</ErrorMsg>;

  return (
    <ContentArea>
      <Header>Welcome to KeepLegacy</Header>
      <p>Your trusted digital legacy and lifestyle advisor</p>

      <CardsGrid>
        <Link to="/medicalinfo">
          <DashboardCard title="Medical Info" info={`${data?.medicalInfoCount || 0} Records`} icon="🩺" />
        </Link>

        <Link to="/bankaccounts">
          <DashboardCard title="Bank Accounts" info={`${data?.bankAccountsCount || 0} Linked Banks`} icon="🏦" />
        </Link>

        <Link to="/insurance">
          <DashboardCard title="Insurance" info={data?.insuranceTypes || '0'} icon="📄" />
        </Link>

        <Link to="/personaldocs">
          <DashboardCard title="Personal Docs" info={`${data?.personalDocsCount || 0} Documents`} icon="📁" />
        </Link>

        <Link to="/investments">
          <DashboardCard title="Investments" info={data?.investmentsSummary || 'No Data'} icon="💹" />
        </Link>

        <Link to="/propertyinfo">
          <DashboardCard title="Property Info" info={`${data?.propertyCount || 0} Properties`} icon="🏡" />
        </Link>

        <Link to="/childrenplans">
          <DashboardCard title="Children Plans" info={`${data?.childrenPlansCount || 0} Plans`} icon="🧒" />
        </Link>

        <Link to="/taxdetails">
          <DashboardCard title="Tax Details" info={data?.taxDetailsSummary || 'No Data'} icon="📊" />
        </Link>

        <Link to="/rationcard">
          <DashboardCard title="Ration Card" info={`${data?.rationCardMembers || 0} Members`} icon="🪪" />
        </Link>

        <Link to="/cibilscore">
          <DashboardCard title="CIBIL Score" info={data?.cibilScoreStatus || 'Unavailable'} icon="💳" />
        </Link>

        <Link to="/consolidatedportfolio">
          <DashboardCard title="Portfolio" info={data?.consolidatedPortfolioSummary || 'No Data'} icon="📈" />
        </Link>
      </CardsGrid>
    </ContentArea>
  );
};

export default Dashboard;