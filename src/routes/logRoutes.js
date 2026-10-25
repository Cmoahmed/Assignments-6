const express = require('express');
const controller = require('../controllers/logController');
const router = express.Router();

// Question 7: Insert a log for the requested book.
router.post('/', controller.insertLog);

module.exports = router;
