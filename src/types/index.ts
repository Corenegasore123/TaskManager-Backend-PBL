import { Request, Response, NextFunction } from 'express';

export interface User {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  password?: string;
  created_at?: Date;
  updated_at?: Date;
}

export interface Task {
  id: number;
  title: string;
  description?: string;
  status: 'todo' | 'ongoing' | 'done';
  priority: 'low' | 'medium' | 'high';
  deadline?: Date;
  user_id: number;
  created_at?: Date;
  updated_at?: Date;
}

export interface Team {
  id: number;
  name: string;
  created_by: number;
  created_at?: Date;
}

export interface TeamMember {
  team_id: number;
  user_id: number;
  role: 'admin' | 'member';
  joined_at?: Date;
}

export interface TaskAssignment {
  task_id: number;
  user_id: number;
  assigned_at?: Date;
}

export interface AuthRequest extends Request {
  user?: {
    id: number;
    email: string;
  };
}

export type RequestHandler = (
  req: Request | AuthRequest,
  res: Response,
  next?: NextFunction
) => Promise<void | Response> | void | Response; 