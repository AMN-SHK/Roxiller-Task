const Transaction = require('../models/Transaction');

exports.getPieChartData = async (req, res) => {
  try {
    const { month } = req.query;
    const monthRegex = new RegExp(`-${month.padStart(2, '0')}-`);

    const pieChartData = await Transaction.aggregate([
      { $match: { dateOfSale: { $regex: monthRegex } } },
      { $group: { _id: '$category', count: { $sum: 1 } } },
      { $project: { category: '$_id', count: 1, _id: 0 } },
    ]);

    res.json(pieChartData);
  } catch (error) {
    console.error('Error fetching pie chart data:', error);
    res.status(500).json({ message: 'Error fetching pie chart data' });
  }
};