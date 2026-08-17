import { Router } from 'express';
import { getProfile, updateProfile, uploadAvatar, getStats } from '../controllers/profile.controller';
import { authenticate } from '../middleware/auth';
import { upload } from '../utils/upload';

const router = Router();

router.get('/me', authenticate, getProfile);
router.put('/me', authenticate, updateProfile);
router.post('/me/avatar', authenticate, upload.single('avatar'), uploadAvatar);
router.get('/me/stats', authenticate, getStats);
router.get('/:userId', getProfile);
router.get('/:userId/stats', getStats);

export default router;
