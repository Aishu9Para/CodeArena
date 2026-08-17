import { Router } from 'express';
import {
  listContests, getContest, registerForContest, getMyContests,
  createContest, updateContest, deleteContest, getOrganizerContests,
  addProblemToContest, removeProblemFromContest, getContestParticipants,
  approveContest, rejectContest, getAllContestsAdmin,
} from '../controllers/contest.controller';
import { authenticate, authorize } from '../middleware/auth';
import { upload } from '../utils/upload';

const router = Router();

// Public
router.get('/', listContests);
router.get('/:id', getContest);

// Student
router.post('/:id/register', authenticate, registerForContest);
router.get('/my/registered', authenticate, getMyContests);

// Organizer
router.post('/', authenticate, authorize('ORGANIZER', 'ADMIN'), upload.single('banner'), createContest);
router.put('/:id', authenticate, authorize('ORGANIZER', 'ADMIN'), upload.single('banner'), updateContest);
router.delete('/:id', authenticate, authorize('ORGANIZER', 'ADMIN'), deleteContest);
router.get('/organizer/my', authenticate, authorize('ORGANIZER', 'ADMIN'), getOrganizerContests);
router.post('/:id/problems', authenticate, authorize('ORGANIZER', 'ADMIN'), addProblemToContest);
router.delete('/:id/problems/:problemId', authenticate, authorize('ORGANIZER', 'ADMIN'), removeProblemFromContest);
router.get('/:id/participants', authenticate, authorize('ORGANIZER', 'ADMIN'), getContestParticipants);

// Admin
router.get('/admin/all', authenticate, authorize('ADMIN'), getAllContestsAdmin);
router.patch('/:id/approve', authenticate, authorize('ADMIN'), approveContest);
router.patch('/:id/reject', authenticate, authorize('ADMIN'), rejectContest);

export default router;
