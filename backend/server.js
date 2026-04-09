import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mediaRoutes from './Routes/mediaRoutes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Main Media Routes
app.use('/api', mediaRoutes);

app.get('/', (req, res) => {
    res.send('XulfMedia Backend Running');
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
