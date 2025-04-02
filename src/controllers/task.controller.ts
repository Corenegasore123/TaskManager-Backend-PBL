import { Request, Response } from 'express';
import { AppDataSource } from '../config/database';
import { Task } from '../models/Task';


const taskRepository = AppDataSource.getRepository(Task);

export const createTask = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      res.status(401).json({ message: 'User not authenticated' });
      return;
    }

    const { title, description, status, priority, deadline } = req.body;
    const task = taskRepository.create({
      title,
      description,
      status,
      priority,
      deadline: deadline ? new Date(deadline) : null,
      userId
    });

    await taskRepository.save(task);
    res.status(201).json({ message: 'Task created successfully', task });
  } catch (error) {
    console.error('Create task error:', error);
    res.status(500).json({ message: 'Error creating task' });
  }
};

export const getTasks = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      res.status(401).json({ message: 'User not authenticated' });
      return;
    }

    const tasks = await taskRepository.find({
      where: { userId },
      order: { createdAt: 'DESC' }
    });

    res.json(tasks);
  } catch (error) {
    console.error('Get tasks error:', error);
    res.status(500).json({ message: 'Error fetching tasks' });
  }
};

export const getTask = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      res.status(401).json({ message: 'User not authenticated' });
      return;
    }

    const taskId = parseInt(req.params.id);
    const task = await taskRepository.findOne({
      where: { id: taskId, userId }
    });

    if (!task) {
      res.status(404).json({ message: 'Task not found' });
      return;
    }

    res.json(task);
  } catch (error) {
    console.error('Get task error:', error);
    res.status(500).json({ message: 'Error fetching task' });
  }
};

export const updateTask = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      res.status(401).json({ message: 'User not authenticated' });
      return;
    }

    const taskId = parseInt(req.params.id);
    const task = await taskRepository.findOne({
      where: { id: taskId, userId }
    });

    if (!task) {
      res.status(404).json({ message: 'Task not found' });
      return;
    }

    const { title, description, status, priority, deadline } = req.body;
    Object.assign(task, {
      title,
      description,
      status,
      priority,
      deadline: deadline ? new Date(deadline) : task.deadline
    });

    await taskRepository.save(task);
    res.json({ message: 'Task updated successfully', task });
  } catch (error) {
    console.error('Update task error:', error);
    res.status(500).json({ message: 'Error updating task' });
  }
};

export const deleteTask = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      res.status(401).json({ message: 'User not authenticated' });
      return;
    }

    const taskId = parseInt(req.params.id);
    const task = await taskRepository.findOne({
      where: { id: taskId, userId }
    });

    if (!task) {
      res.status(404).json({ message: 'Task not found' });
      return;
    }

    await taskRepository.remove(task);
    res.json({ message: 'Task deleted successfully' });
  } catch (error) {
    console.error('Delete task error:', error);
    res.status(500).json({ message: 'Error deleting task' });
  }
}; 