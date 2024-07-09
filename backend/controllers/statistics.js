const Transaction = require('../models/Transaction');

exports.getStatistics = async (req, res) => {
  try {
    const { month } = req.query;
    const monthRegex = new RegExp(`-${month.padStart(2, '0')}-`);

    const totalSaleAmount = await Transaction.aggregate([
      { $match: { dateOfSale: { $regex: monthRegex }, sold: true } },
      { $group: { _id: null, total: { $sum: '$price' } } },
    ]);

    const totalSoldItems = await Transaction.countDocuments({
      dateOfSale: { $regex: monthRegex },
      sold: true,
    });

    const totalNotSoldItems = await Transaction.countDocuments({
      dateOfSale: { $regex: monthRegex },
      sold: false,
    });

    res.json({
      totalSaleAmount: totalSaleAmount[0]?.total || 0,
      totalSoldItems,
      totalNotSoldItems,
    });
  } catch (error) {
    console.error('Error fetching statistics:', error);
    res.status(500).json({ message: 'Error fetching statistics' });
  }
};