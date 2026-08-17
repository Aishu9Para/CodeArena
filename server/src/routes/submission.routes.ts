import { Router } from 'express';
import { submitSolution, getMySubmissions, getSubmission, getContestSubmissions } from '../controllers/submission.controller';
import { authenticate, authorize } from '../middleware/auth';
import { upload } from '../utils/upload';

const router = Router();

router.post('/', authenticate, upload.single('file'), submitSolution);
router.get('/my', authenticate, getMySubmissions);
router.get('/:id', authenticate, getSubmission);
router.get('/contest/:contestId', authenticate, authorize('ORGANIZER', 'ADMIN'), getContestSubmissions);

export default router;
