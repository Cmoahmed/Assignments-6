const express = require('express');
const controller = require('../controllers/collectionController');
const router = express.Router();

// Question 1: Create books with its MongoDB validator.
router.post('/books', controller.createBooks);
// Question 2: Insert an author to create authors implicitly.
router.post('/authors', controller.insertAuthor);
// Question 3: Create capped logs.
router.post('/logs/capped', controller.createCappedLogs);
// Question 4: Create the title index.
router.post('/books/index', controller.createTitleIndex);

module.exports = router;
