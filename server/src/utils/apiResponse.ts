import { Response } from 'express';

export function success(res: Response, data: unknown, message = 'Success', status = 200) {
  return res.status(status).json({ success: true, message, data });
}

export function error(res: Response, message = 'Something went wrong', status = 500, errors?: unknown) {
  return res.status(status).json({ success: false, message, errors });
}
