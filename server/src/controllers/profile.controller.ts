import { Response } from 'express';
import { prisma } from '../config/prisma';
import { success, error } from '../utils/apiResponse';
import { AuthRequest } from '../middleware/auth';
import { uploadToCloudinary } from '../utils/cloudinaryUpload';
import { param } from '../utils/params';

export async function getProfile(req: AuthRequest, res: Response) {
  try {
    const userId = req.params.userId ? param(req.params.userId) : req.user!.userId;
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true, name: true, email: true, role: true, college: true, createdAt: true,
        profile: true,
        registrations: {
          include: { contest: { select: { id: true, title: true, startTime: true, endTime: true, status: true } } },
          orderBy: { registeredAt: 'desc' },
          take: 10,
        },
        certificates: {
          include: { contest: { select: { id: true, title: true } } },
          orderBy: { issuedAt: 'desc' },
        },
      },
    });
    if (!user) return error(res, 'User not found', 404);
    return success(res, user);
  } catch (e) {
    return error(res, 'Failed to get profile');
  }
}

export async function updateProfile(req: AuthRequest, res: Response) {
  try {
    const { name, college, bio, github, linkedin, website } = req.body;
    const userId = req.user!.userId;

    await prisma.user.update({ where: { id: userId }, data: { name, college } });

    const profile = await prisma.profile.upsert({
      where: { userId },
      create: { userId, bio, github, linkedin, website },
      update: { bio, github, linkedin, website },
    });

    return success(res, profile, 'Profile updated');
  } catch (e) {
    return error(res, 'Failed to update profile');
  }
}

export async function uploadAvatar(req: AuthRequest, res: Response) {
  try {
    if (!req.file) return error(res, 'No file provided', 400);
    const result = await uploadToCloudinary(req.file.buffer, 'codearena/avatars', 'image');
    const profile = await prisma.profile.update({
      where: { userId: req.user!.userId },
      data: { avatarUrl: result.secure_url },
    });
    return success(res, { avatarUrl: profile.avatarUrl }, 'Avatar updated');
  } catch (e) {
    return error(res, 'Failed to upload avatar');
  }
}

export async function getStats(req: AuthRequest, res: Response) {
  try {
    const userId = req.params.userId ? param(req.params.userId) : req.user!.userId;
    const [totalContests, totalSolved, totalCerts] = await Promise.all([
      prisma.registration.count({ where: { userId } }),
      prisma.submission.count({ where: { userId, status: 'ACCEPTED' } }),
      prisma.certificate.count({ where: { userId } }),
    ]);
    return success(res, { totalContests, totalSolved, totalCerts });
  } catch (e) {
    return error(res, 'Failed to get stats');
  }
}
