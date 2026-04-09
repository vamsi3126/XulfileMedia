import express from 'express';
import { analyzeMedia, getDownloadStream } from '../Controllers/mediaController.js';

const router = express.Router();

router.post('/analyze', analyzeMedia);
router.post('/download', getDownloadStream);

export default router;
