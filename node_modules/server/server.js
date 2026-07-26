const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });

const app = require('./src/app');
const connectDB = require('./src/config/db');

const initialPort = parseInt(process.env.PORT || '5000', 10);

connectDB().then(() => {
  const startServer = (port) => {
    const server = app.listen(port, () => {
      console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${port}`);
    });

    server.on('error', (err) => {
      if (err.code === 'EADDRINUSE') {
        console.warn(`Port ${port} is currently in use by another process. Automatically switching to port ${port + 1}...`);
        startServer(port + 1);
      } else {
        console.error('Server execution error:', err.message);
      }
    });
  };

  startServer(initialPort);
}).catch(err => {
  console.error('Failed to initialize database connection:', err.message);
});
