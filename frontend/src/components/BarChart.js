import React, { useState, useEffect } from 'react';
import { fetchBarChartData } from '../utils/api';
import { BarChart as RechartsBarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { CircularProgress } from '@mui/material';

const BarChart = ({ month }) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const getMonthName = (monthNumber) => {
    const date = new Date();
    date.setMonth(monthNumber - 1);
    return date.toLocaleString('default', { month: 'long' });
  };

  useEffect(() => {
    const getBarChartData = async () => {
      setLoading(true);
      try {
        const chartData = await fetchBarChartData(month);
        setData(chartData);
      } catch (error) {
        console.error("Error fetching bar chart data:", error);
      } finally {
        setLoading(false);
      }
    };
    getBarChartData();
  }, [month]);

  if (loading) {
    return <CircularProgress />;
  }

  return (
    <div className="bar-chart">
      <h2>Price Range Distribution - {getMonthName(month)}</h2>
      <ResponsiveContainer width="100%" height={300}>
        <RechartsBarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="range" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="count" fill="#8884d8" />
        </RechartsBarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default BarChart;