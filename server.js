require('dotenv').config();
const app = require('./src/app');
const { connectToDatabase, closeDatabase } = require('./src/config/db');

const port = Number(process.env.PORT) || 3001;

async function startServer() {
  try {
    await connectToDatabase();
    const server = app.listen(port, () => console.log(`Server listening on http://localhost:${port}`));
    const stop = async () => {
      server.close(async () => {
        await closeDatabase();
        process.exit(0);
      });
    };
    process.on('SIGINT', stop);
    process.on('SIGTERM', stop);
  } catch (error) {
    console.error(`Could not start the server: ${error.message}`);
    process.exit(1);
  }
}

startServer();
