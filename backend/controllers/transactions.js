const Transaction = require('../models/Transaction');

exports.getTransactions = async (req, res) => {
  try {
    const { month, search, page = 1, perPage = 10 } = req.query;
    const skip = (page - 1) * perPage;

    let query = {};

    // Month filter
    if (month) {
      const monthNum = parseInt(month, 10);
      query.dateOfSale = {
        $regex: `-${monthNum.toString().padStart(2, '0')}-`,
      };
    }

    // Search filter
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { price: isNaN(parseFloat(search)) ? 0 : parseFloat(search) },
      ];
    }

    console.log('MongoDB query:', JSON.stringify(query));

    const total = await Transaction.countDocuments(query);
    const transactions = await Transaction.find(query)
      .sort({ dateOfSale: -1 })
      .skip(skip)
      .limit(parseInt(perPage));

    console.log('Total matching documents:', total);
    console.log('Fetched transactions:', transactions.length);

    res.json({
      transactions,
      total,
      page: parseInt(page),
      perPage: parseInt(perPage),
      totalPages: Math.ceil(total / perPage),
    });
  } catch (error) {
    console.error('Error fetching transactions:', error);
    res.status(500).json({ message: 'Error fetching transactions', error: error.message });
  }
};