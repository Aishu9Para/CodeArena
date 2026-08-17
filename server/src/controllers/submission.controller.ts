import { Response } from 'express';
import { prisma } from '../config/prisma';
import { success, error } from '../utils/apiResponse';
import { AuthRequest } from '../middleware/auth';
import { uploadToCloudinary } from '../utils/cloudinaryUpload';
import { param } from '../utils/params';

export async function submitSolution(req: AuthRequest, res: Response) {
  try {
    const { problemId, contestId, language, code } = req.body;
    const userId = req.user!.userId;

    if (contestId) {
      const reg = await prisma.registration.findUnique({
        where: { userId_contestId: { userId, contestId } },
      });
      if (!reg) return error(res, 'Not registered for this contest', 403);

      const contest = await prisma.contest.findUnique({ where: { id: contestId } });
      if (!contest) return error(res, 'Contest not found', 404);
      if (contest.status !== 'RUNNING' && contest.status !== 'APPROVED')
        return error(res, 'Contest is not active', 400);
    }

    let fileUrl: string | undefined;
    if (req.file) {
      const result = await uploadToCloudinary(req.file.buffer, 'codearena/submissions', 'raw');
      fileUrl = result.secure_url;
    }

    // Simulated grading (replace with a real judge in production)
    const score = Math.floor(Math.random() * 100);
    const statuses = ['ACCEPTED', 'WRONG_ANSWER', 'ACCEPTED', 'ACCEPTED'] as const;
    const status = statuses[Math.floor(Math.random() * statuses.length)];

    const submission = await prisma.submission.create({
      data: {
        userId, problemId,
        contestId: contestId || null,
        language,
        code: code || null,
        fileUrl: fileUrl || null,
        status,
        score: status === 'ACCEPTED' ? score : 0,
        penalty: status !== 'ACCEPTED' ? 20 : 0,
        timeTaken: Math.random() * 1000,
        submittedAt: new Date(),
      },
      include: {
        problem: { select: { title: true } },
        contest: { select: { title: true } },
      },
    });

    await prisma.notification.create({
      data: {
        userId,
        type: 'SUBMISSION_RESULT',
        title: `Submission ${status === 'ACCEPTED' ? 'Accepted' : 'Wrong Answer'}`,
        message: `Your solution for "${submission.problem.title}" was ${status === 'ACCEPTED' ? 'accepted' : 'incorrect'}.`,
        link: `/submissions/${submission.id}`,
      },
    });

    if (status === 'ACCEPTED') {
      await prisma.profile.update({
        where: { userId },
        data: { totalSolved: { increment: 1 } },
      });
    }

    return success(res, submission, 'Submission received', 201);
  } catch (e) {
    console.error(e);
    return error(res, 'Failed to submit');
  }
}

export async function getMySubmissions(req: AuthRequest, res: Response) {
  try {
    const { contestId, problemId, page = '1', limit = '20' } = req.query as Record<string, string>;
    const pageNum = Math.max(1, parseInt(page));
    const take = Math.min(100, parseInt(limit));
    const skip = (pageNum - 1) * take;

    const where: Record<string, unknown> = { userId: req.user!.userId };
    if (contestId) where.contestId = contestId;
    if (problemId) where.problemId = problemId;

    const [submissions, total] = await Promise.all([
      prisma.submission.findMany({
        where,
        skip,
        take,
        orderBy: { submittedAt: 'desc' },
        include: {
          problem: { select: { id: true, title: true } },
          contest: { select: { id: true, title: true } },
        },
      }),
      prisma.submission.count({ where }),
    ]);

    return success(res, { submissions, total, page: pageNum, totalPages: Math.ceil(total / take) });
  } catch (e) {
    return error(res, 'Failed to fetch submissions');
  }
}

export async function getSubmission(req: AuthRequest, res: Response) {
  try {
    const id = param(req.params.id);
    const sub = await prisma.submission.findUnique({
      where: { id },
      include: {
        problem: true,
        contest: { select: { id: true, title: true } },
        user: { select: { id: true, name: true } },
      },
    });
    if (!sub) return error(res, 'Submission not found', 404);
    if (sub.userId !== req.user!.userId && req.user!.role === 'STUDENT')
      return error(res, 'Forbidden', 403);
    return success(res, sub);
  } catch (e) {
    return error(res, 'Failed to fetch submission');
  }
}

export async function getContestSubmissions(req: AuthRequest, res: Response) {
  try {
    const contestId = param(req.params.contestId);
    const contest = await prisma.contest.findUnique({ where: { id: contestId } });
    if (!contest) return error(res, 'Contest not found', 404);
    if (contest.organizerId !== req.user!.userId && req.user!.role !== 'ADMIN')
      return error(res, 'Forbidden', 403);

    const submissions = await prisma.submission.findMany({
      where: { contestId },
      orderBy: { submittedAt: 'desc' },
      include: {
        user: { select: { id: true, name: true, email: true } },
        problem: { select: { id: true, title: true } },
      },
    });
    return success(res, submissions);
  } catch (e) {
    return error(res, 'Failed to fetch submissions');
  }
}
