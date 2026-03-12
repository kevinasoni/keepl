import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import Sidebar from './components/Sidebar';

import Dashboard from './pages/Dashboard';
import Beneficiaries from './pages/Beneficiaries';
import MyFiles from './pages/MyFiles';
import AiAdvisor from './pages/AIAdvisor';
import Lifestyle from './pages/Lifestyle';
import Settings from './pages/Settings';

import MedicalInfo from './pages/MedicalInfo';
import BankAccounts from './pages/BankAccounts';
import Insurance from './pages/Insurance';
import PersonalDocs from './pages/PersonalDocs';
import Investments from './pages/Investments';
import PropertyInfo from './pages/PropertyInfo';
import ChildrenPlans from './pages/ChildrenPlans';
import TaxDetails from './pages/TaxDetails';
import RationCard from './pages/RationCard';
import CIBILScore from './pages/CIBILScore';
import ConsolidatedPortfolio from './pages/ConsolidatedPortfolio';
import Vault from './pages/Vault';

import Register from './pages/Register';
import Login from './pages/Login';
import Home from './pages/Home';

// Sidebar layout
const SidebarLayout = () => (
  <div style={{ display: 'flex', minHeight: '100vh' }}>
    <Sidebar />
    <div style={{ flex: 1, padding: 20 }}>
      <Outlet />
    </div>
  </div>
);

function App() {
  return (
    <Router>
      <Routes>
        {/* Public pages */}
        <Route path="/" element={<Navigate to="/home" replace />} />
        <Route path="/home" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Pages with sidebar */}
        <Route element={<SidebarLayout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/beneficiaries" element={<Beneficiaries />} />
          <Route path="/myfiles" element={<MyFiles />} />
          <Route path="/aiadvisor" element={<AiAdvisor />} />
          <Route path="/lifestyle" element={<Lifestyle />} />
          <Route path="/settings" element={<Settings />} />

          <Route path="/medicalinfo" element={<MedicalInfo />} />
          <Route path="/bankaccounts" element={<BankAccounts />} />
          <Route path="/insurance" element={<Insurance />} />
          <Route path="/personaldocs" element={<PersonalDocs />} />
          <Route path="/investments" element={<Investments />} />
          <Route path="/propertyinfo" element={<PropertyInfo />} />
          <Route path="/childrenplans" element={<ChildrenPlans />} />
          <Route path="/taxdetails" element={<TaxDetails />} />
          <Route path="/rationcard" element={<RationCard />} />
          <Route path="/cibilscore" element={<CIBILScore />} />
          <Route path="/consolidatedportfolio" element={<ConsolidatedPortfolio />} />
          <Route path="/vault" element={<Vault />} />
        </Route>

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/home" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
