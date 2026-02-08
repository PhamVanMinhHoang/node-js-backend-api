import express from 'express';

const app = express();

// middleware parse json
app.use(express.json());

app.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    data: { status: 'OK' },
    error: null
  });
});

export default app;