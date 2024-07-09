import React, { useState } from 'react';
import TransactionsTable from './TransactionsTable';
import Statistics from './Statistics';
import BarChart from './BarChart';
import PieChart from './PieChart';
import { Select, MenuItem, FormControl, InputLabel } from '@mui/material';
import '../styles/Dashboard.css';

const Dashboard = () => {
  const [month, setMonth] = useState('3'); // Default to March

  const handleMonthChange = (event) => {
    setMonth(event.target.value);
  };

  const months = [
    { value: '1', name: 'January' },
    { value: '2', name: 'February' },
    { value: '3', name: 'March' },
    { value: '4', name: 'April' },
    { value: '5', name: 'May' },
    { value: '6', name: 'June' },
    { value: '7', name: 'July' },
    { value: '8', name: 'August' },
    { value: '9', name: 'September' },
    { value: '10', name: 'October' },
    { value: '11', name: 'November' },
    { value: '12', name: 'December' }
  ];

  return (
    <div className="dashboard">
      <h1>Transaction Dashboard</h1>
      <FormControl variant="outlined" style={{ minWidth: 120, marginBottom: 20 }}>
        <InputLabel>Month</InputLabel>
        <Select value={month} onChange={handleMonthChange} label="Month">
          {months.map((m) => (
            <MenuItem key={m.value} value={m.value}>{m.name}</MenuItem>
          ))}
        </Select>
      </FormControl>
      <div className="dashboard-grid">
      <div className="wide-card">
        <TransactionsTable month={month} />
      </div>
      <Statistics month={month} />
      <div className="wide-card">
        <BarChart month={month} />
      </div>
      <PieChart month={month} />
    </div>
    </div>
  );
};

export default Dashboard;