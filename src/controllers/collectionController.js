const { getDatabase } = require('../config/db');

// Question 1: Create or update the books collection with title validation.
async function createBooks(req, res, next) {
  try {
    const db = getDatabase();
    const validator = {
      $jsonSchema: {
        bsonType: 'object',
        required: ['title'],
        properties: {
          title: {
            bsonType: 'string',
            pattern: '.*\\S.*',
            description: 'title must be a non-empty, non-whitespace string'
          }
        }
      }
    };
    const exists = await db.listCollections({ name: 'books' }).hasNext();
    if (!exists) {
      await db.createCollection('books', { validator, validationLevel: 'strict', validationAction: 'error' });
    } else {
      await db.command({ collMod: 'books', validator, validationLevel: 'strict', validationAction: 'error' });
    }
    res.json({ ok: 1 });
  } catch (error) { next(error); }
}

// Question 2: Insert directly so MongoDB implicitly creates the authors collection.
async function insertAuthor(req, res, next) {
  try {
    const { name, nationality } = req.body;
    if (!name || !nationality) return res.status(400).json({ error: 'name and nationality are required.' });
    const result = await getDatabase().collection('authors').insertOne({ name, nationality });
    res.status(201).json({ message: 'Author inserted.', insertedId: result.insertedId });
  } catch (error) { next(error); }
}

// Question 3: Create a capped logs collection without dropping any existing data.
async function createCappedLogs(req, res, next) {
  try {
    const db = getDatabase();
    const info = await db.listCollections({ name: 'logs' }).toArray();
    if (info.length === 0) {
      await db.createCollection('logs', { capped: true, size: 1048576 });
      return res.json({ ok: 1 });
    }
    if (info[0].options?.capped && info[0].options?.size === 1048576) return res.json({ ok: 1 });
    return res.status(409).json({
      error: 'The existing logs collection is not capped at exactly 1 MB. Existing data was preserved. See README recovery instructions.'
    });
  } catch (error) { next(error); }
}

// Question 4: Create the ascending title index.
async function createTitleIndex(req, res, next) {
  try {
    const indexName = await getDatabase().collection('books').createIndex({ title: 1 });
    res.json({ indexName });
  } catch (error) { next(error); }
}

module.exports = { createBooks, insertAuthor, createCappedLogs, createTitleIndex };
