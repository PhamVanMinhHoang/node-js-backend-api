import express from 'express';
import dotenv from 'dotenv';
import userRoutes from './routes/user.route.js';
import { notFound } from './middlewares/notFound.js';
import { errorHandler } from './middlewares/errorHandler.js';
import { ok } from './utils/response.js';

dotenv.config();

const app = express();

// middleware parse json
app.use(express.json());

app.use((req, res, next) => {
  const start = process.hrtime.bigint(); // chính xác cao (ns)

  res.on('finish', () => {
    const end = process.hrtime.bigint();
    const durationMs = Number(end - start) / 1e6;

    console.log(
      `[${req.method}] ${req.originalUrl} -> ${res.statusCode} ${durationMs.toFixed(2)} ms`
    );
  });

  next();
});


//=====
app.get('/health', (req, res) => {
   return ok(res, 'good health', null)
});

app.get('/api/v1/ping', (req, res) => {
    return ok(res, { message: 'pong' })
});

//=== 
app.use('/api/v1/users', userRoutes);

// 404 handler (phải đặt sau routes)
app.use(notFound);

// global error handler (phải đặt cuối cùng)
app.use(errorHandler);

export default app;