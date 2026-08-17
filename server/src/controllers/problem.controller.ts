import { Request, Response } from 'express';
import { prisma } from '../config/prisma';
import { success, error } from '../utils/apiResponse';
import { AuthRequest } from '../middleware/auth';
import { param } from '../utils/params';

export async function listProblems(req: Request, res: Response) {
  try {
    const { search, difficulty, tags, page = '1', limit = '20' } = req.query as Record<string, string>;
    const pageNum = Math.max(1, parseInt(page));
    const take = Math.min(100, parseInt(limit));
    const skip = (pageNum - 1) * take;

    const where: Record<string, unknown> = { isPublic: true };
    if (search) where.title = { contains: search, mode: 'insensitive' };
    if (difficulty) where.difficulty = difficulty;
    if (tags) where.tags = { hasSome: tags.split(',') };

    const [problems, total] = await Promise.all([
      prisma.problem.findMany({
        where,
        skip,
        take,
        orderBy: { createdAt: 'desc' },
        select: { id: true, title: true, difficulty: true, tags: true, maxScore: true, createdAt: true },
      }),
      prisma.problem.count({ where }),
    ]);

    return success(res, { problems, total, page: pageNum, totalPages: Math.ceil(total / take) });
  } catch (e) {
    return error(res, 'Failed to fetch problems');
  }
}

export async function getProblem(req: Request, res: Response) {
  try {
    const id = param(req.params.id);
    const problem = await prisma.problem.findUnique({
      where: { id },
      include: { examples: { orderBy: { orderIndex: 'asc' } } },
    });
    if (!problem) return error(res, 'Problem not found', 404);
    return success(res, problem);
  } catch (e) {
    return error(res, 'Failed to fetch problem');
  }
}

export async function createProblem(req: AuthRequest, res: Response) {
  try {
    const {
      title, description, inputFormat, outputFormat, constraints,
      explanation, difficulty, tags, maxScore, timeLimit, memoryLimit,
      isPublic, examples, testCases,
    } = req.body;

    const problem = await prisma.problem.create({
      data: {
        title, description, inputFormat, outputFormat, constraints,
        explanation, difficulty: difficulty || 'MEDIUM',
        tags: Array.isArray(tags) ? tags : [],
        maxScore: maxScore || 100,
        timeLimit: timeLimit || 2,
        memoryLimit: memoryLimit || 256,
        isPublic: isPublic || false,
        creatorId: req.user!.userId,
        examples: {
          create: (examples || []).map((e: { input: string; output: string; explanation?: string }, i: number) => ({
            input: e.input, output: e.output, explanation: e.explanation, orderIndex: i,
          })),
        },
        testCases: {
          create: (testCases || []).map((t: { input: string; output: string; isHidden?: boolean; points?: number }, i: number) => ({
            input: t.input, output: t.output,
            isHidden: t.isHidden || false, points: t.points || 10, orderIndex: i,
          })),
        },
      },
      include: { examples: true, testCases: true },
    });

    return success(res, problem, 'Problem created', 201);
  } catch (e) {
    console.error(e);
    return error(res, 'Failed to create problem');
  }
}

export async function updateProblem(req: AuthRequest, res: Response) {
  try {
    const id = param(req.params.id);
    const problem = await prisma.problem.findUnique({ where: { id } });
    if (!problem) return error(res, 'Problem not found', 404);
    if (problem.creatorId !== req.user!.userId && req.user!.role !== 'ADMIN')
      return error(res, 'Forbidden', 403);

    const {
      title, description, inputFormat, outputFormat, constraints,
      explanation, difficulty, tags, maxScore, timeLimit, memoryLimit, isPublic,
    } = req.body;

    const updated = await prisma.problem.update({
      where: { id },
      data: {
        title, description, inputFormat, outputFormat, constraints,
        explanation, difficulty, tags, maxScore, timeLimit, memoryLimit, isPublic,
      },
    });
    return success(res, updated, 'Problem updated');
  } catch (e) {
    return error(res, 'Failed to update problem');
  }
}

export async function deleteProblem(req: AuthRequest, res: Response) {
  try {
    const id = param(req.params.id);
    const problem = await prisma.problem.findUnique({ where: { id } });
    if (!problem) return error(res, 'Problem not found', 404);
    if (problem.creatorId !== req.user!.userId && req.user!.role !== 'ADMIN')
      return error(res, 'Forbidden', 403);

    await prisma.problem.delete({ where: { id } });
    return success(res, null, 'Problem deleted');
  } catch (e) {
    return error(res, 'Failed to delete problem');
  }
}

export async function getOrganizerProblems(req: AuthRequest, res: Response) {
  try {
    const problems = await prisma.problem.findMany({
      where: { creatorId: req.user!.userId },
      orderBy: { createdAt: 'desc' },
      select: {
        id: true, title: true, difficulty: true, tags: true,
        maxScore: true, isPublic: true, createdAt: true,
        _count: { select: { submissions: true } },
      },
    });
    return success(res, problems);
  } catch (e) {
    return error(res, 'Failed to fetch problems');
  }
}
