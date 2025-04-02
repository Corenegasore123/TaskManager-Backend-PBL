import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt, { Secret, SignOptions } from 'jsonwebtoken';
import { AppDataSource } from '../config/database';
import { User } from '../models/User';

const userRepository = AppDataSource.getRepository(User);

export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const { firstName, lastName, email, password } = req.body;

    const existingUser = await userRepository.findOne({ where: { email } });
    if (existingUser) {
      res.status(400).json({ message: 'Email already registered' });
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = userRepository.create({
      firstName,
      lastName,
      email,
      password: hashedPassword
    });

    await userRepository.save(user);
    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Error registering user' });
  }
};

export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    const user = await userRepository.findOne({ where: { email } });
    if (!user) {
      res.status(401).json({ message: 'Invalid email or password' });
      return;
    }

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      res.status(401).json({ message: 'Invalid email or password' });
      return;
    }

    const secret: Secret = process.env.JWT_SECRET || 'your-secret-key';
    const signOptions: SignOptions = {
      expiresIn: '24h'
    };
    
    const token = jwt.sign(
      { id: user.id, email: user.email },
      secret,
      signOptions
    );

    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Error during login' });
  }
};

export const updateProfile = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      res.status(401).json({ message: 'User not authenticated' });
      return;
    }

    const user = await userRepository.findOne({ where: { id: userId } });
    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }

    const { firstName, lastName, currentPassword, newPassword } = req.body;

    if (currentPassword && newPassword) {
      const validPassword = await bcrypt.compare(currentPassword, user.password);
      if (!validPassword) {
        res.status(401).json({ message: 'Current password is incorrect' });
        return;
      }
      user.password = await bcrypt.hash(newPassword, 10);
    }

    if (firstName) user.firstName = firstName;
    if (lastName) user.lastName = lastName;

    await userRepository.save(user);
    res.json({ message: 'Profile updated successfully' });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ message: 'Error updating profile' });
  }
}; 