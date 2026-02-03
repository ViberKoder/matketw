import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { requestsRouter } from './routes/requests';
import { vestingRouter } from './routes/vesting';
import { priceRouter } from './routes/price';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Routes
app.use('/api/requests', requestsRouter);
app.use('/api/vesting', vestingRouter);
app.use('/api/price', priceRouter);

// Health check
app.get('/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.listen(PORT, () => {
    console.log(`🚀 Backend server running on port ${PORT}`);
});
