import express from 'express';
import {
    getElectionResults,
    createCandidate,
    updateCandidate,
    deleteCandidate
} from '../controllers/adminController';
import { protect, admin } from '../middleware/authMiddleware'; // 👈 Ensure this path is correct

const router = express.Router();

// 🌍 Public Route
// Used by the Homepage Tally to show live numbers
router.get('/results', getElectionResults);

// 🔐 Admin Protected Routes
// Requires valid JWT (protect) and admin role (admin)
router.post('/candidates', protect, admin, createCandidate);
router.put('/candidates/:id', protect, admin, updateCandidate);
router.delete('/candidates/:id', protect, admin, deleteCandidate);

export default router;