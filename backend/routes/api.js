const express = require('express');
const router = express.Router();

const initializeDBController = require('../controllers/initializeDB');
const transactionsController = require('../controllers/transactions');
const statisticsController = require('../controllers/statistics');
const barChartController = require('../controllers/barChart');
const pieChartController = require('../controllers/pieChart');
const combinedDataController = require('../controllers/combinedData');

router.get('/initialize-db', initializeDBController.initializeDB);
router.get('/transactions', transactionsController.getTransactions);
router.get('/statistics', statisticsController.getStatistics);
router.get('/bar-chart', barChartController.getBarChartData);
router.get('/pie-chart', pieChartController.getPieChartData);
router.get('/combined-data', combinedDataController.getCombinedData);

module.exports = router;