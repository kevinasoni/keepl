import React, { useState } from 'react';
import './Lifestyle.css';

const clamp = (val, min, max) => Math.max(min, Math.min(val, max));

// Simple tooltip component
const Tooltip = ({ text }) => (
  <span className="tooltip">
    &#9432;
    <span className="tooltip-text">{text}</span>
  </span>
);

const Lifestyle = () => {
  const [bankBalance, setBankBalance] = useState('');
  const [loanAmount, setLoanAmount] = useState('');
  const [savings, setSavings] = useState('');
  const [investmentScore, setInvestmentScore] = useState('');
  const [monthlyExpenses, setMonthlyExpenses] = useState('');
  const [score, setScore] = useState(null);
  const [status, setStatus] = useState('');
  const [suggestions, setSuggestions] = useState([]);

  let savingsRatio = 0,
      debtRatio = 1,
      debtScore = 0,
      emergencyFundRatio = 0,
      investment = 0,
      lifestyleScore = 0;

  const calculateScore = () => {
    const bank = parseFloat(bankBalance) || 0;
    const loan = Math.max(0, parseFloat(loanAmount) || 0);
    const save = Math.max(0, parseFloat(savings) || 0);
    const invest = clamp(parseFloat(investmentScore) || 0, 0, 100);
    const expenses = Math.max(parseFloat(monthlyExpenses) || 0, 0);

    const yearlyExpenses = expenses * 12 || 1;
    const totalAssets = bank + save || 1;

    savingsRatio = clamp(save / (save + yearlyExpenses), 0, 1);
    debtRatio = totalAssets > 0 ? clamp(loan / totalAssets, 0, 1) : 1;
    debtScore = 1 - debtRatio;
    emergencyFundRatio = clamp(bank / (6 * expenses || 1), 0, 1);
    investment = invest / 100;

    lifestyleScore = Math.round(
      (savingsRatio * 25) +
      (debtScore * 25) +
      (emergencyFundRatio * 25) +
      (investment * 25)
    );

    let statusText = '';
    if (lifestyleScore >= 80) statusText = 'Excellent';
    else if (lifestyleScore >= 60) statusText = 'Good';
    else if (lifestyleScore >= 40) statusText = 'Average';
    else statusText = 'Needs Attention';

    const suggestionsArr = [];
    if (savingsRatio < 0.2)
      suggestionsArr.push({ 
        text: `Increase your savings. Save at least ₹${Math.ceil(yearlyExpenses * 0.2)} per year (20% of expenses).`, 
        color: 'orange' });
    if (debtRatio > 0.3)
      suggestionsArr.push({ 
        text: `Reduce loans to less than 30% of assets (currently ${(debtRatio*100).toFixed(1)}%).`, 
        color: 'red' });
    if (emergencyFundRatio < 1)
      suggestionsArr.push({ 
        text: `Build emergency funds equal to at least 6 months of expenses (₹${(6*expenses).toFixed(0)}).`, 
        color: 'red' });
    if (invest < 55)
      suggestionsArr.push({ 
        text: `Improve investment strategy (current score: ${invest}). Consider diversifying and researching options.`, 
        color: 'orange' });
    if (suggestionsArr.length === 0)
      suggestionsArr.push({ 
        text: 'Your financial lifestyle is on track. Keep it up!', 
        color: 'green' });

    setScore(lifestyleScore);
    setStatus(statusText);
    setSuggestions(suggestionsArr);
  };

  // Define color coding for statuses
  const getColor = (val) => {
    if(val >= 0.8) return 'green';
    if(val >= 0.6) return 'orange';
    return 'red';
  };

  return (
    <div className="lifestyle-container">
      <div className="lifestyle-content">
        <h2>Lifestyle Score Calculator</h2>
        <div className="form-section">
          <label>
            Bank Balance 
            <Tooltip text="Amount currently available in your bank accounts" />
            <input
              type="number"
              value={bankBalance}
              onChange={(e) => setBankBalance(e.target.value)}
              placeholder="e.g. 85000 (Check your bank statement)"
            />
          </label>
          <label>
            Loan Amount 
            <Tooltip text="Total outstanding loans such as home loan, car loan, etc." />
            <input
              type="number"
              value={loanAmount}
              onChange={(e) => setLoanAmount(e.target.value)}
              placeholder="e.g. 50000 (Sum of all loans you currently owe)"
            />
          </label>
          <label>
            Total Savings
            <Tooltip text="Total amount saved across all savings accounts, fixed deposits, etc." />
            <input
              type="number"
              value={savings}
              onChange={(e) => setSavings(e.target.value)}
              placeholder="e.g. 45000 (Sum of all your savings)"
            />
          </label>
          <label>
            Monthly Expenses 
            <Tooltip text="Average total monthly household expenses" />
            <input
              type="number"
              value={monthlyExpenses}
              onChange={(e) => setMonthlyExpenses(e.target.value)}
              placeholder="e.g. 30000 (Estimate your monthly spending)"
            />
          </label>
          <label>
            Investment Score (0-100)
            <Tooltip text="Your self-rated investment knowledge and diversification (0 = none, 100 = expert)" />
            <input
              type="number"
              value={investmentScore}
              onChange={(e) => setInvestmentScore(e.target.value)}
              min="0"
              max="100"
              placeholder="e.g. 60 (Rate yourself from 0 to 100)"
            />
          </label>
          <button onClick={calculateScore}>Calculate Lifestyle Score</button>
        </div>

        {score !== null && (
          <div className="score-section">
            <div className="overall-score" style={{ color: getColor(score / 100) }}>
              <h3>Your Lifestyle Score: {score} / 100</h3>
              <p>Status: <strong>{status}</strong></p>
            </div>

            <div className="breakdown">
              <h4>Score Breakdown</h4>
              <ul>
                <li style={{ color: getColor(savingsRatio) }}>
                  Savings Health: {(savingsRatio * 100).toFixed(1)}%
                </li>
                <li style={{ color: getColor(debtScore) }}>
                  Debt Health: {(debtScore * 100).toFixed(1)}%
                </li>
                <li style={{ color: getColor(emergencyFundRatio) }}>
                  Emergency Fund: {(emergencyFundRatio * 100).toFixed(1)}%
                </li>
                <li style={{ color: getColor(investment) }}>
                  Investment Score: {(investment * 100).toFixed(1)}%
                </li>
              </ul>
            </div>

            <div className="suggestion-box">
              <h4>Suggestions</h4>
              {suggestions.map((s, i) => (
                <p key={i} style={{ color: s.color, fontWeight: 'bold' }}>
                  • {s.text}
                </p>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Lifestyle;
