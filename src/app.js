const express = require('express');
const collectionRoutes = require('./routes/collectionRoutes');
const bookRoutes = require('./routes/bookRoutes');
const logRoutes = require('./routes/logRoutes');

const app = express();
app.use(express.json());
app.use('/collection', collectionRoutes);
app.use('/books', bookRoutes);
app.use('/logs', logRoutes);

app.use((error, req, res, next) => {
  console.error(error.message);
  res.status(500).json({ error: 'The request could not be completed. Check the server configuration and request data.' });
});

module.exports = app;
