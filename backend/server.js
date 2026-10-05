import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mediaRoutes from './Routes/mediaRoutes.js';

dotenv.config();

// Prevent unhandled promise rejections or stream aborts from crashing the server
process.on('uncaughtException', (err) => {
    console.error('Uncaught Exception:', err.message);
});
process.on('unhandledRejection', (reason) => {
    console.error('Unhandled Rejection:', reason?.message || reason);
});

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Main Media & File Routes
app.use('/api', mediaRoutes);

app.get('/', (req, res) => {
    res.json({
        name: 'XulfMedia Universal Downloader API',
        status: 'online',
        supported: ['Direct Files (PDF, ZIP, DOCX, APK, EXE)', 'Cloud Drives (Google Drive, Dropbox)', 'YouTube', 'Instagram', 'TikTok', 'Facebook', 'Twitter / X', 'Reddit', 'Vimeo', 'SoundCloud']
    });
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
