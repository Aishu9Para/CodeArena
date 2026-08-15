import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import { prisma } from '../config/prisma';
import { signToken } from '../utils/jwt';
import { success, error } from '../utils/apiResponse';
import { sendMail } from '../config/mailer';
import { AuthRequest } from '../middleware/auth';
import { env } from '../config/env';

export async function register(req: Request, res: Response) {
  try {
    const { name, email, password, college } = req.body;
    const exists = await prisma.user.findUnique({ where: { email } });
    if (exists) return error(res, 'Email already registered', 400);

    const hashed = await bcrypt.hash(password, 12);
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashed,
        college,
        profile: { create: {} },
      },
      select: { id: true, name: true, email: true, role: true, college: true, createdAt: true },
    });

    const token = signToken({ userId: user.id, role: user.role, email: user.email });
    return success(res, { user, token }, 'Registration successful', 201);
  } catch (e) {
    console.error(e);
    return error(res, 'Registration failed');
  }
}

export async function login(req: Request, res: Response) {
  try {
    const { email, password } = req.body;
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return error(res, 'Invalid credentials', 401);
    if (user.isBlocked) return error(res, 'Account is blocked', 403);

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return error(res, 'Invalid credentials', 401);

    const token = signToken({ userId: user.id, role: user.role, email: user.email });
    const { password: _p, ...safeUser } = user;
    return success(res, { user: safeUser, token }, 'Login successful');
  } catch (e) {
    console.error(e);
    return error(res, 'Login failed');
  }
}

export async function getMe(req: AuthRequest, res: Response) {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user!.userId },
      select: {
        id: true, name: true, email: true, role: true, college: true,
        createdAt: true, isBlocked: true,
        profile: true,
      },
    });
    if (!user) return error(res, 'User not found', 404);
    return success(res, user);
  } catch (e) {
    return error(res, 'Failed to get user');
  }
}

export async function forgotPassword(req: Request, res: Response) {
  try {
    const { email } = req.body;
    const user = await prisma.user.findUnique({ where: { email } });
    // Always return success to prevent email enumeration
    if (!user) return success(res, null, 'If that email exists, a reset link was sent');

    const token = crypto.randomBytes(32).toString('hex');
    const expires = new Date(Date.now() + 1000 * 60 * 60); // 1 hour

    await prisma.user.update({
      where: { id: user.id },
      data: { passwordResetToken: token, passwordResetExpires: expires },
    });

    const resetUrl = `${env.FRONTEND_URL}/reset-password?token=${token}`;
    await sendMail(
      email,
      'CodeArena – Reset Your Password',
      `<h2>Password Reset</h2><p>Click <a href="${resetUrl}">here</a> to reset your password. This link expires in 1 hour.</p>`
    );

    return success(res, null, 'If that email exists, a reset link was sent');
  } catch (e) {
    return error(res, 'Failed to process request');
  }
}

export async function resetPassword(req: Request, res: Response) {
  try {
    const { token, password } = req.body;
    const user = await prisma.user.findFirst({
      where: {
        passwordResetToken: token,
        passwordResetExpires: { gt: new Date() },
      },
    });
    if (!user) return error(res, 'Invalid or expired reset token', 400);

    const hashed = await bcrypt.hash(password, 12);
    await prisma.user.update({
      where: { id: user.id },
      data: { password: hashed, passwordResetToken: null, passwordResetExpires: null },
    });

    return success(res, null, 'Password reset successful');
  } catch (e) {
    return error(res, 'Failed to reset password');
  }
}

export async function changePassword(req: AuthRequest, res: Response) {
  try {
    const { currentPassword, newPassword } = req.body;
    const user = await prisma.user.findUnique({ where: { id: req.user!.userId } });
    if (!user) return error(res, 'User not found', 404);

    const valid = await bcrypt.compare(currentPassword, user.password);
    if (!valid) return error(res, 'Current password is incorrect', 400);

    const hashed = await bcrypt.hash(newPassword, 12);
    await prisma.user.update({ where: { id: user.id }, data: { password: hashed } });

    return success(res, null, 'Password changed successfully');
  } catch (e) {
    return error(res, 'Failed to change password');
  }
}
