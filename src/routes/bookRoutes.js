const express = require('express');
const controller = require('../controllers/bookController');
const router = express.Router();

// Question 5: Insert one book.
router.post('/', controller.insertBook);
// Question 6: Insert multiple books.
router.post('/batch', controller.insertBooks);
// Question 8: Update Future.
router.patch('/Future', controller.updateFuture);
// Question 9: Find a book by title.
router.get('/title', controller.findByTitle);
// Question 10: Find books in a year range.
router.get('/year', controller.findByYearRange);
// Question 11: Find books by genre.
router.get('/genre', controller.findByGenre);
// Question 12: Sort, skip, and limit books.
router.get('/skip-limit', controller.findSkipLimit);
// Question 13: Find integer years.
router.get('/year-integer', controller.findIntegerYears);
// Question 14: Exclude two genres.
router.get('/exclude-genres', controller.excludeGenres);
// Question 15: Delete books before a year.
router.delete('/before-year', controller.deleteBeforeYear);
// Question 16: Aggregate and sort.
router.get('/aggregate1', controller.aggregate1);
// Question 17: Aggregate and project fields.
router.get('/aggregate2', controller.aggregate2);
// Question 18: Aggregate and unwind genres.
router.get('/aggregate3', controller.aggregate3);
// Question 19: Aggregate with the logs lookup.
router.get('/aggregate4', controller.aggregate4);

module.exports = router;
