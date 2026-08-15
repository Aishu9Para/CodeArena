import { PrismaClient, Role } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  // Admin
  const adminPass = await bcrypt.hash('Admin@1234', 12);
  const admin = await prisma.user.upsert({
    where: { email: 'admin@codearena.dev' },
    update: {},
    create: {
      email: 'admin@codearena.dev',
      name: 'Admin User',
      password: adminPass,
      role: Role.ADMIN,
      profile: { create: {} },
    },
  });

  // Organizer
  const orgPass = await bcrypt.hash('Organizer@1234', 12);
  const organizer = await prisma.user.upsert({
    where: { email: 'organizer@codearena.dev' },
    update: {},
    create: {
      email: 'organizer@codearena.dev',
      name: 'Demo Organizer',
      password: orgPass,
      role: Role.ORGANIZER,
      college: 'Tech University',
      profile: { create: { bio: 'Contest organizer for Tech University.' } },
    },
  });

  // Student
  const stuPass = await bcrypt.hash('Student@1234', 12);
  await prisma.user.upsert({
    where: { email: 'student@codearena.dev' },
    update: {},
    create: {
      email: 'student@codearena.dev',
      name: 'Demo Student',
      password: stuPass,
      role: Role.STUDENT,
      college: 'Tech University',
      profile: { create: { bio: 'Competitive programmer.' } },
    },
  });

  // Sample problems
  const problem1 = await prisma.problem.upsert({
    where: { id: 'sample-problem-1' },
    update: {},
    create: {
      id: 'sample-problem-1',
      title: 'Two Sum',
      description: 'Given an array of integers, return indices of the two numbers such that they add up to a specific target.',
      inputFormat: 'First line: array of integers. Second line: target integer.',
      outputFormat: 'Two space-separated indices.',
      constraints: '2 <= n <= 10^4, -10^9 <= nums[i] <= 10^9',
      difficulty: 'EASY',
      tags: ['array', 'hash-table'],
      maxScore: 100,
      creatorId: organizer.id,
      isPublic: true,
      examples: {
        create: [
          { input: 'nums = [2,7,11,15], target = 9', output: '[0,1]', explanation: 'nums[0] + nums[1] = 9', orderIndex: 0 },
        ],
      },
    },
  });

  const problem2 = await prisma.problem.upsert({
    where: { id: 'sample-problem-2' },
    update: {},
    create: {
      id: 'sample-problem-2',
      title: 'Fibonacci Sequence',
      description: 'Print the nth Fibonacci number.',
      inputFormat: 'Single integer n.',
      outputFormat: 'Single integer.',
      constraints: '1 <= n <= 50',
      difficulty: 'MEDIUM',
      tags: ['dynamic-programming', 'math'],
      maxScore: 100,
      creatorId: organizer.id,
      isPublic: true,
      examples: {
        create: [
          { input: '10', output: '55', orderIndex: 0 },
        ],
      },
    },
  });

  // Sample contest
  const now = new Date();
  const start = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000); // 7 days from now
  const end = new Date(start.getTime() + 3 * 60 * 60 * 1000); // 3h contest

  await prisma.contest.upsert({
    where: { id: 'sample-contest-1' },
    update: {},
    create: {
      id: 'sample-contest-1',
      title: 'CodeArena Inaugural Contest #1',
      description: 'Welcome to the first CodeArena contest! Solve algorithm problems and climb the leaderboard.',
      rules: '1. No plagiarism\n2. One submission per language per problem\n3. Have fun!',
      prize: 'Top 3 winners receive certificates and recognition.',
      organizerId: organizer.id,
      status: 'APPROVED',
      visibility: 'PUBLIC',
      startTime: start,
      endTime: end,
      duration: 180,
      registrationDeadline: new Date(start.getTime() - 60 * 60 * 1000),
      problems: {
        create: [
          { problemId: problem1.id, orderIndex: 0, maxScore: 100 },
          { problemId: problem2.id, orderIndex: 1, maxScore: 100 },
        ],
      },
    },
  });

  console.log('Seed complete!');
  console.log('Admin:     admin@codearena.dev / Admin@1234');
  console.log('Organizer: organizer@codearena.dev / Organizer@1234');
  console.log('Student:   student@codearena.dev / Student@1234');
}

main()
  .catch(e => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
