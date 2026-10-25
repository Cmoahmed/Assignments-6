const { ObjectId } = require('mongodb');
const { getDatabase } = require('../config/db');

// Question 7: Insert a log with book_id converted to ObjectId when supplied as a string.
async function insertLog(req, res, next) {
  try {
    const { book_id, action } = req.body;
    if (book_id === undefined || !action) return res.status(400).json({ error: 'book_id and action are required.' });
    let bookId = book_id;
    if (typeof book_id === 'string') {
      if (!ObjectId.isValid(book_id)) return res.status(400).json({ error: 'book_id must be a valid 24-character ObjectId string.' });
      bookId = new ObjectId(book_id);
    }
    const result = await getDatabase().collection('logs').insertOne({ book_id: bookId, action });
    res.status(201).json({ message: 'Log inserted.', insertedId: result.insertedId });
  } catch (error) { next(error); }
}

module.exports = { insertLog };
