const { getDatabase } = require('../config/db');

function books() { return getDatabase().collection('books'); }

// Question 5: Insert one book and return its reusable MongoDB ID.
async function insertBook(req, res, next) {
  try {
    const result = await books().insertOne(req.body);
    res.status(201).json({ message: 'Book inserted.', insertedId: result.insertedId });
  } catch (error) { next(error); }
}

// Question 6: Insert the assignment sample books together.
async function insertBooks(req, res, next) {
  try {
    if (!Array.isArray(req.body.books) || req.body.books.length < 3) {
      return res.status(400).json({ error: 'Send a books array containing at least three books.' });
    }
    const result = await books().insertMany(req.body.books);
    res.status(201).json({ message: 'Books inserted.', insertedCount: result.insertedCount, insertedIds: result.insertedIds });
  } catch (error) { next(error); }
}

// Question 8: Update the year for the exact Future title.
async function updateFuture(req, res, next) {
  try {
    const result = await books().updateOne({ title: 'Future' }, { $set: { year: 2022 } });
    if (result.matchedCount === 0) {
      return res.status(404).json({ message: 'No book with the exact title Future was found.', matchedCount: 0, modifiedCount: 0 });
    }
    res.json({ matchedCount: result.matchedCount, modifiedCount: result.modifiedCount });
  } catch (error) { next(error); }
}

// Question 9: Find books by an exact title.
async function findByTitle(req, res, next) {
  try {
    if (!req.query.title) return res.status(400).json({ error: 'The title query parameter is required.' });
    const result = await books().find({ title: req.query.title }).toArray();
    res.json(result);
  } catch (error) { next(error); }
}

// Question 10: Find books in an inclusive numeric year range.
async function findByYearRange(req, res, next) {
  try {
    const from = Number(req.query.from);
    const to = Number(req.query.to);
    if (req.query.from === undefined || req.query.to === undefined || !Number.isInteger(from) || !Number.isInteger(to) || from > to) {
      return res.status(400).json({ error: 'from and to must be whole-number years, with from less than or equal to to.' });
    }
    res.json(await books().find({ year: { $gte: from, $lte: to } }).toArray());
  } catch (error) { next(error); }
}

// Question 11: Match the supplied genre inside the genres array.
async function findByGenre(req, res, next) {
  try {
    if (!req.query.genre) return res.status(400).json({ error: 'The genre query parameter is required.' });
    res.json(await books().find({ genres: req.query.genre }).toArray());
  } catch (error) { next(error); }
}

// Question 12: Sort by year, skip two results, and return the next three.
async function findSkipLimit(req, res, next) {
  try {
    res.json(await books().find({}).sort({ year: -1, _id: 1 }).skip(2).limit(3).toArray());
  } catch (error) { next(error); }
}

// Question 13: Find documents whose year has BSON integer type.
async function findIntegerYears(req, res, next) {
  try { res.json(await books().find({ year: { $type: 'int' } }).toArray()); }
  catch (error) { next(error); }
}

// Question 14: Exclude books containing either disallowed genre.
async function excludeGenres(req, res, next) {
  try { res.json(await books().find({ genres: { $nin: ['Horror', 'Science Fiction'] } }).toArray()); }
  catch (error) { next(error); }
}

// Question 15: Delete all books with a year below the requested threshold.
async function deleteBeforeYear(req, res, next) {
  try {
    const year = Number(req.query.year);
    if (req.query.year === undefined || !Number.isInteger(year)) return res.status(400).json({ error: 'year must be a whole number.' });
    const result = await books().deleteMany({ year: { $lt: year } });
    res.json({ acknowledged: result.acknowledged, deletedCount: result.deletedCount });
  } catch (error) { next(error); }
}

// Question 16: Aggregate books newer than 2000 and sort newest first.
async function aggregate1(req, res, next) {
  try { res.json(await books().aggregate([{ $match: { year: { $gt: 2000 } } }, { $sort: { year: -1 } }]).toArray()); }
  catch (error) { next(error); }
}

// Question 17: Project only title, author, and year for books newer than 2000.
async function aggregate2(req, res, next) {
  try { res.json(await books().aggregate([{ $match: { year: { $gt: 2000 } } }, { $project: { _id: 0, title: 1, author: 1, year: 1 } }]).toArray()); }
  catch (error) { next(error); }
}

// Question 18: Unwind genres and return each title with one genre.
async function aggregate3(req, res, next) {
  try { res.json(await books().aggregate([{ $unwind: '$genres' }, { $project: { _id: 0, title: 1, genres: 1 } }]).toArray()); }
  catch (error) { next(error); }
}

// Question 19: Join books to logs through the matching BSON ObjectId.
async function aggregate4(req, res, next) {
  try {
    res.json(await books().aggregate([
      { $lookup: { from: 'logs', localField: '_id', foreignField: 'book_id', as: 'book_details' } },
      { $unwind: '$book_details' },
      { $project: { _id: 0, action: '$book_details.action', book_details: { title: '$title', author: '$author', year: '$year' } } }
    ]).toArray());
  } catch (error) { next(error); }
}

module.exports = { insertBook, insertBooks, updateFuture, findByTitle, findByYearRange, findByGenre, findSkipLimit, findIntegerYears, excludeGenres, deleteBeforeYear, aggregate1, aggregate2, aggregate3, aggregate4 };
