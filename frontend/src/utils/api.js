import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api'; // Adjust this to your backend URL

export const fetchTransactions = async (month, page = 1, perPage = 10, search = '') => {
    console.log(`Fetching transactions for month: ${month}, page: ${page}, search: ${search}`);
    const response = await axios.get(`${API_BASE_URL}/transactions`, {
      params: { month, page, perPage, search },
    });
    console.log('Received transactions:', response.data);
    return response.data;
  };

export const fetchStatistics = async (month) => {
  const response = await axios.get(`${API_BASE_URL}/statistics`, {
    params: { month },
  });
  return response.data;
};

export const fetchBarChartData = async (month) => {
  const response = await axios.get(`${API_BASE_URL}/bar-chart`, {
    params: { month },
  });
  return response.data;
};

export const fetchPieChartData = async (month) => {
  const response = await axios.get(`${API_BASE_URL}/pie-chart`, {
    params: { month },
  });
  return response.data;
};