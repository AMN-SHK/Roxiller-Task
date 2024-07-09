const axios = require('axios');
const Transaction = require('../models/Transaction');

exports.initializeDB = async (req, res) => {
  try {
    const response = await axios.get(process.env.THIRD_PARTY_API_URL);
    const transactions = response.data;

    await Transaction.deleteMany({}); // Clear existing data
    await Transaction.insertMany(transactions);

    res.json({ message: 'Database initialized successfully' });
  } catch (error) {
    console.error('Error initializing database:', error);
    res.status(500).json({ message: 'Error initializing database' });
  }
};