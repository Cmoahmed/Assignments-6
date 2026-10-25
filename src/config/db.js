const { MongoClient } = require('mongodb');

let client;
let database;

async function connectToDatabase() {
  if (database) return database;

  const uri = process.env.MONGODB_URI;
  const databaseName = process.env.DB_NAME;
  if (!uri || !databaseName) {
    throw new Error('Set MONGODB_URI and DB_NAME in your .env file.');
  }

  client = new MongoClient(uri);
  await client.connect();
  database = client.db(databaseName);
  return database;
}

function getDatabase() {
  if (!database) throw new Error('The database connection is not ready.');
  return database;
}

async function closeDatabase() {
  if (client) await client.close();
  client = undefined;
  database = undefined;
}

module.exports = { connectToDatabase, getDatabase, closeDatabase };
