const Transaction = require('../models/Transaction');

exports.getBarChartData = async (req, res) => {
  try {
    const { month } = req.query;
    const monthRegex = new RegExp(`-${month.padStart(2, '0')}-`);

    const priceRanges = [
      { min: 0, max: 100 },
      { min: 101, max: 200 },
      { min: 201, max: 300 },
      { min: 301, max: 400 },
      { min: 401, max: 500 },
      { min: 501, max: 600 },
      { min: 601, max: 700 },
      { min: 701, max: 800 },
      { min: 801, max: 900 },
      { min: 901, max: Infinity },
    ];

    const barChartData = await Promise.all(
      priceRanges.map(async (range) => {
        const count = await Transaction.countDocuments({
          dateOfSale: { $regex: monthRegex },
          price: { $gte: range.min, $lte: range.max },
        });
        return {
          range: `${range.min} - ${range.max === Infinity ? 'above' : range.max}`,
          count,
        };
      })
    );

    res.json(barChartData);
  } catch (error) {
    console.error('Error fetching bar chart data:', error);
    res.status(500).json({ message: 'Error fetching bar chart data' });
  }
};