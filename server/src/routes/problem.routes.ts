import { Router } from 'express';
import {
  listProblems, getProblem, createProblem,
  updateProblem, deleteProblem, getOrganizerProblems,
} from '../controllers/problem.controller';
import { authenticate, authorize } from '../middleware/auth';

const router = Router();

router.get('/', listProblems);
router.get('/my', authenticate, authorize('ORGANIZER', 'ADMIN'), getOrganizerProblems);
router.get('/:id', getProblem);
router.post('/', authenticate, authorize('ORGANIZER', 'ADMIN'), createProblem);
router.put('/:id', authenticate, authorize('ORGANIZER', 'ADMIN'), updateProblem);
router.delete('/:id', authenticate, authorize('ORGANIZER', 'ADMIN'), deleteProblem);

export default router;
