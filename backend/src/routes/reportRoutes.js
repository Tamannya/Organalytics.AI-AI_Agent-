import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { 
  analyzeData, 
  getReport, 
  getUserReports, 
  deleteReport, 
  exportReport,
  extractVisionData,
  confirmVisionAnalysis,
  runSimulation,
  chatWithReport
} from '../controllers/reportController.js';
import { authenticateToken } from '../middlewares/auth.js';

const router = express.Router();

// Multimonial screenshot upload configuration
const uploadDir = 'uploads/';
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'screenshot-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const fileFilter = (req, file, cb) => {
  const allowedExtensions = ['.jpg', '.jpeg', '.png', '.webp', '.pdf'];
  const ext = path.extname(file.originalname).toLowerCase();
  
  if (allowedExtensions.includes(ext)) {
    cb(null, true);
  } else {
    cb(new Error('Only JPG, PNG, WEBP, or PDF files are allowed'), false);
  }
};

const uploadVision = multer({
  storage,
  fileFilter,
  limits: { fileSize: 10 * 1024 * 1024 } // 10MB limit
});

// Original routes
router.post('/analyze', authenticateToken, analyzeData);
router.get('/reports/:id', authenticateToken, getReport);
router.get('/reports/user/:userId', authenticateToken, getUserReports);
router.post('/reports/:id/export', authenticateToken, exportReport);
router.delete('/reports/:id', authenticateToken, deleteReport);
router.get('/reports', authenticateToken, getUserReports);

// New features routes
router.post('/vision/extract', authenticateToken, uploadVision.single('file'), extractVisionData);
router.post('/vision/confirm-and-analyze', authenticateToken, confirmVisionAnalysis);
router.post('/simulate', authenticateToken, runSimulation);
router.post('/reports/:id/chat', authenticateToken, chatWithReport);

export default router;
