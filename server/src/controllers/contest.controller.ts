import { Request, Response } from 'express';
import { prisma } from '../config/prisma';
import { success, error } from '../utils/apiResponse';
import { AuthRequest } from '../middleware/auth';
import { ContestStatus } from '@prisma/client';
import { uploadToCloudinary } from '../utils/cloudinaryUpload';
import { param } from '../utils/params';

// ─── Public ───────────────────────────────────────────────────────────────────

export async function listContests(req: Request, res: Response) {
  try {
    const { status, search, page = '1', limit = '12' } = req.query as Record<string, string>;
    const pageNum = Math.max(1, parseInt(page));
    const take = Math.min(50, parseInt(limit));
    const skip = (pageNum - 1) * take;

    const where: Record<string, unknown> = {
      visibility: 'PUBLIC',
      status: { not: 'DRAFT' },
    };
    if (status && status !== 'ALL') where.status = status;
    if (search) where.title = { contains: search, mode: 'insensitive' };

    const [contests, total] = await Promise.all([
      prisma.contest.findMany({
        where,
        skip,
        take,
        orderBy: { startTime: 'asc' },
        include: {
          organizer: { select: { id: true, name: true, college: true } },
          _count: { select: { registrations: true } },
        },
      }),
      prisma.contest.count({ where }),
    ]);

    return success(res, { contests, total, page: pageNum, totalPages: Math.ceil(total / take) });
  } catch (e) {
    return error(res, 'Failed to fetch contests');
  }
}

export async function getContest(req: Request, res: Response) {
  try {
    const id = param(req.params.id);
    const contest = await prisma.contest.findUnique({
      where: { id },
      include: {
        organizer: { select: { id: true, name: true, college: true } },
        problems: {
          include: { problem: { select: { id: true, title: true, difficulty: true, tags: true, maxScore: true } } },
          orderBy: { orderIndex: 'asc' },
        },
        announcements: { orderBy: { createdAt: 'desc' } },
        _count: { select: { registrations: true } },
      },
    });
    if (!contest) return error(res, 'Contest not found', 404);
    return success(res, contest);
  } catch (e) {
    return error(res, 'Failed to fetch contest');
  }
}

// ─── Student ──────────────────────────────────────────────────────────────────

export async function registerForContest(req: AuthRequest, res: Response) {
  try {
    const contestId = param(req.params.id);
    const userId = req.user!.userId;
    const { password } = req.body;

    const contest = await prisma.contest.findUnique({ where: { id: contestId } });
    if (!contest) return error(res, 'Contest not found', 404);
    if (contest.status === 'COMPLETED' || contest.status === 'CANCELLED')
      return error(res, 'Registration closed', 400);
    if (new Date() > contest.registrationDeadline)
      return error(res, 'Registration deadline passed', 400);

    if (contest.visibility === 'PRIVATE') {
      if (!password || password !== contest.accessPassword)
        return error(res, 'Incorrect contest password', 403);
    }

    const existing = await prisma.registration.findUnique({
      where: { userId_contestId: { userId, contestId } },
    });
    if (existing) return error(res, 'Already registered', 400);

    const reg = await prisma.registration.create({ data: { userId, contestId } });

    await prisma.notification.create({
      data: {
        userId,
        type: 'CONTEST_REGISTERED',
        title: 'Registration Confirmed',
        message: `You have successfully registered for "${contest.title}".`,
        link: `/contests/${contestId}`,
      },
    });

    return success(res, reg, 'Registered successfully', 201);
  } catch (e) {
    return error(res, 'Failed to register');
  }
}

export async function getMyContests(req: AuthRequest, res: Response) {
  try {
    const regs = await prisma.registration.findMany({
      where: { userId: req.user!.userId },
      include: {
        contest: {
          include: {
            organizer: { select: { id: true, name: true } },
            _count: { select: { registrations: true } },
          },
        },
      },
      orderBy: { registeredAt: 'desc' },
    });
    return success(res, regs);
  } catch (e) {
    return error(res, 'Failed to fetch contests');
  }
}

// ─── Organizer ────────────────────────────────────────────────────────────────

export async function createContest(req: AuthRequest, res: Response) {
  try {
    const {
      title, description, rules, prize,
      startTime, endTime, duration, registrationDeadline,
      visibility, accessPassword,
    } = req.body;

    let bannerUrl: string | undefined;
    if (req.file) {
      const result = await uploadToCloudinary(req.file.buffer, 'codearena/banners');
      bannerUrl = result.secure_url;
    }

    const contest = await prisma.contest.create({
      data: {
        title, description, rules, prize,
        startTime: new Date(startTime),
        endTime: new Date(endTime),
        duration: parseInt(duration),
        registrationDeadline: new Date(registrationDeadline),
        visibility: visibility || 'PUBLIC',
        accessPassword: visibility === 'PRIVATE' ? accessPassword : null,
        organizerId: req.user!.userId,
        status: 'PENDING_APPROVAL',
        bannerUrl,
      },
    });

    return success(res, contest, 'Contest created and submitted for approval', 201);
  } catch (e) {
    console.error(e);
    return error(res, 'Failed to create contest');
  }
}

export async function updateContest(req: AuthRequest, res: Response) {
  try {
    const id = param(req.params.id);
    const contest = await prisma.contest.findUnique({ where: { id } });
    if (!contest) return error(res, 'Contest not found', 404);
    if (contest.organizerId !== req.user!.userId && req.user!.role !== 'ADMIN')
      return error(res, 'Forbidden', 403);

    let bannerUrl = contest.bannerUrl;
    if (req.file) {
      const result = await uploadToCloudinary(req.file.buffer, 'codearena/banners');
      bannerUrl = result.secure_url;
    }

    const { title, description, rules, prize, startTime, endTime, duration, registrationDeadline, visibility, accessPassword } = req.body;

    const updated = await prisma.contest.update({
      where: { id },
      data: {
        title, description, rules, prize, bannerUrl,
        startTime: startTime ? new Date(startTime) : undefined,
        endTime: endTime ? new Date(endTime) : undefined,
        duration: duration ? parseInt(duration) : undefined,
        registrationDeadline: registrationDeadline ? new Date(registrationDeadline) : undefined,
        visibility,
        accessPassword: visibility === 'PRIVATE' ? accessPassword : null,
      },
    });

    return success(res, updated, 'Contest updated');
  } catch (e) {
    return error(res, 'Failed to update contest');
  }
}

export async function deleteContest(req: AuthRequest, res: Response) {
  try {
    const id = param(req.params.id);
    const contest = await prisma.contest.findUnique({ where: { id } });
    if (!contest) return error(res, 'Contest not found', 404);
    if (contest.organizerId !== req.user!.userId && req.user!.role !== 'ADMIN')
      return error(res, 'Forbidden', 403);

    await prisma.contest.delete({ where: { id } });
    return success(res, null, 'Contest deleted');
  } catch (e) {
    return error(res, 'Failed to delete contest');
  }
}

export async function getOrganizerContests(req: AuthRequest, res: Response) {
  try {
    const contests = await prisma.contest.findMany({
      where: { organizerId: req.user!.userId },
      include: { _count: { select: { registrations: true, problems: true } } },
      orderBy: { createdAt: 'desc' },
    });
    return success(res, contests);
  } catch (e) {
    return error(res, 'Failed to fetch contests');
  }
}

export async function addProblemToContest(req: AuthRequest, res: Response) {
  try {
    const contestId = param(req.params.id);
    const { problemId, orderIndex, maxScore } = req.body;

    const contest = await prisma.contest.findUnique({ where: { id: contestId } });
    if (!contest) return error(res, 'Contest not found', 404);
    if (contest.organizerId !== req.user!.userId) return error(res, 'Forbidden', 403);

    const cp = await prisma.contestProblem.create({
      data: { contestId, problemId, orderIndex: orderIndex || 0, maxScore: maxScore || 100 },
    });
    return success(res, cp, 'Problem added', 201);
  } catch (e) {
    return error(res, 'Failed to add problem');
  }
}

export async function removeProblemFromContest(req: AuthRequest, res: Response) {
  try {
    const contestId = param(req.params.id);
    const problemId = param(req.params.problemId);
    const contest = await prisma.contest.findUnique({ where: { id: contestId } });
    if (!contest) return error(res, 'Contest not found', 404);
    if (contest.organizerId !== req.user!.userId) return error(res, 'Forbidden', 403);

    await prisma.contestProblem.deleteMany({ where: { contestId, problemId } });
    return success(res, null, 'Problem removed');
  } catch (e) {
    return error(res, 'Failed to remove problem');
  }
}

export async function getContestParticipants(req: AuthRequest, res: Response) {
  try {
    const contestId = param(req.params.id);
    const { search, status } = req.query as Record<string, string>;

    const contest = await prisma.contest.findUnique({ where: { id: contestId } });
    if (!contest) return error(res, 'Contest not found', 404);
    if (contest.organizerId !== req.user!.userId && req.user!.role !== 'ADMIN')
      return error(res, 'Forbidden', 403);

    const where: Record<string, unknown> = { contestId };
    if (status) where.status = status;

    const regs = await prisma.registration.findMany({
      where,
      include: { user: { select: { id: true, name: true, email: true, college: true } } },
      orderBy: { registeredAt: 'asc' },
    });

    const filtered = search
      ? regs.filter(r =>
          r.user.name.toLowerCase().includes(search.toLowerCase()) ||
          r.user.email.toLowerCase().includes(search.toLowerCase())
        )
      : regs;

    return success(res, filtered);
  } catch (e) {
    return error(res, 'Failed to fetch participants');
  }
}

// ─── Admin ────────────────────────────────────────────────────────────────────

export async function approveContest(req: AuthRequest, res: Response) {
  try {
    const id = param(req.params.id);
    const contest = await prisma.contest.update({
      where: { id },
      data: { status: 'APPROVED' as ContestStatus },
    });

    await prisma.notification.create({
      data: {
        userId: contest.organizerId,
        type: 'CONTEST_APPROVED',
        title: 'Contest Approved',
        message: `Your contest "${contest.title}" has been approved.`,
        link: `/organizer/contests/${contest.id}`,
      },
    });

    return success(res, contest, 'Contest approved');
  } catch (e) {
    return error(res, 'Failed to approve contest');
  }
}

export async function rejectContest(req: AuthRequest, res: Response) {
  try {
    const id = param(req.params.id);
    const { reason } = req.body;
    const contest = await prisma.contest.update({
      where: { id },
      data: { status: 'REJECTED' as ContestStatus },
    });

    await prisma.notification.create({
      data: {
        userId: contest.organizerId,
        type: 'CONTEST_REJECTED',
        title: 'Contest Rejected',
        message: `Your contest "${contest.title}" was rejected. ${reason || ''}`,
        link: `/organizer/contests`,
      },
    });

    return success(res, contest, 'Contest rejected');
  } catch (e) {
    return error(res, 'Failed to reject contest');
  }
}

export async function getAllContestsAdmin(req: AuthRequest, res: Response) {
  try {
    const { status, search, page = '1', limit = '20' } = req.query as Record<string, string>;
    const pageNum = Math.max(1, parseInt(page));
    const take = Math.min(100, parseInt(limit));
    const skip = (pageNum - 1) * take;

    const where: Record<string, unknown> = {};
    if (status) where.status = status;
    if (search) where.title = { contains: search, mode: 'insensitive' };

    const [contests, total] = await Promise.all([
      prisma.contest.findMany({
        where,
        skip,
        take,
        orderBy: { createdAt: 'desc' },
        include: {
          organizer: { select: { id: true, name: true, email: true } },
          _count: { select: { registrations: true } },
        },
      }),
      prisma.contest.count({ where }),
    ]);

    return success(res, { contests, total, page: pageNum, totalPages: Math.ceil(total / take) });
  } catch (e) {
    return error(res, 'Failed to fetch contests');
  }
}
