import React, { useState, useEffect } from 'react';
import { fetchStatistics } from '../utils/api';
import { Card, CardContent, Typography, CircularProgress } from '@mui/material';

const Statistics = ({ month }) => {
  const [stats, setStats] = useState({
    totalSaleAmount: 0,
    totalSoldItems: 0,
    totalNotSoldItems: 0
  });
  const [loading, setLoading] = useState(true);
  const getMonthName = (monthNumber) => {
    const date = new Date();
    date.setMonth(monthNumber - 1);
    return date.toLocaleString('default', { month: 'long' });
  };

  useEffect(() => {
    const getStatistics = async () => {
      setLoading(true);
      try {
        const data = await fetchStatistics(month);
        setStats(data);
      } catch (error) {
        console.error("Error fetching statistics:", error);
      } finally {
        setLoading(false);
      }
    };
    getStatistics();
  }, [month]);

  if (loading) {
    return <CircularProgress />;
  }

  return (
    <div className="statistics">
      <h2>Statistics - {getMonthName(month)}</h2>
      <div className="stats-grid">
        <Card>
          <CardContent>
            <Typography variant="h6">Total Sale</Typography>
            <Typography variant="h4">${stats.totalSaleAmount.toFixed(2)}</Typography>
          </CardContent>
        </Card>
        <Card>
          <CardContent>
            <Typography variant="h6">Total Sold Items</Typography>
            <Typography variant="h4">{stats.totalSoldItems}</Typography>
          </CardContent>
        </Card>
        <Card>
          <CardContent>
            <Typography variant="h6">Total Not Sold Items</Typography>
            <Typography variant="h4">{stats.totalNotSoldItems}</Typography>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Statistics;