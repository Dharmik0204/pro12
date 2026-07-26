const allowedOrigins = [
  'http://localhost:5173',
  'http://127.0.0.1:5173',
  'http://localhost:3000',
  'http://127.0.0.1:3000',
  process.env.CLIENT_URL,
].filter(Boolean);

const corsOptions = {
  origin: (origin, callback) => {
    console.log('Incoming origin:', origin);
    console.log('Allowed origins:', allowedOrigins);
    // If no origin (e.g. mobile apps, Postman, curl, same-origin) or origin is in allowed list
    if (!origin || allowedOrigins.some(o => o && (o === origin || o.replace(/\/$/, '') === origin.replace(/\/$/, '')))) {
      callback(null, true);
    } else {
      // In development or if unconfigured, allow all localhost origins to prevent CORS blockages
      if (process.env.NODE_ENV !== 'production' || origin.includes('localhost') || origin.includes('127.0.0.1')) {
        callback(null, true);
      } else {
        callback(new Error(`Not allowed by CORS: ${origin}`));
      }
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
};

module.exports = corsOptions;