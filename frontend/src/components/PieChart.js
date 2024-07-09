import React, { useState, useEffect } from 'react';
import { fetchPieChartData } from '../utils/api';
import { PieChart as RechartsPieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { CircularProgress, Typography, Box } from '@mui/material';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <Box sx={{ backgroundColor: 'white', padding: '10px', border: '1px solid #ccc' }}>
        <Typography>{`${data.category}: ${data.count} items`}</Typography>
      </Box>
    );
  }
  return null;
};

const PieChart = ({ month }) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getPieChartData = async () => {
      setLoading(true);
      try {
        const chartData = await fetchPieChartData(month);
        setData(chartData);
      } catch (error) {
        console.error("Error fetching pie chart data:", error);
        setData([]);
      } finally {
        setLoading(false);
      }
    };
    getPieChartData();
  }, [month]);

  if (loading) {
    return <CircularProgress />;
  }

  if (data.length === 0) {
    return <Typography>No data available for the selected month.</Typography>;
  }

  return (
    <Box sx={{ height: '400px', width: '100%' }}>
      <Typography variant="h6" align="center" gutterBottom>
        Category Distribution - {new Date(2023, month - 1).toLocaleString('default', { month: 'long' })}
      </Typography>
      <ResponsiveContainer width="100%" height="100%">
        <RechartsPieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            labelLine={false}
            outerRadius={120}
            fill="#8884d8"
            dataKey="count"
            nameKey="category"
            label={({ category, percent }) => `${category}: ${(percent * 100).toFixed(0)}%`}
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
          <Legend layout="vertical" align="right" verticalAlign="middle" />
        </RechartsPieChart>
      </ResponsiveContainer>
    </Box>
  );
};

export default PieChart;