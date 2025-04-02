import { Request, Response } from 'express';
import { AppDataSource } from '../config/database';
import { Team } from '../models/Team';
import { TeamMember } from '../models/TeamMember';
import { User } from '../models/User';

const teamRepository = AppDataSource.getRepository(Team);
const teamMemberRepository = AppDataSource.getRepository(TeamMember);
const userRepository = AppDataSource.getRepository(User);

export const createTeam = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      res.status(401).json({ message: 'User not authenticated' });
      return;
    }

    const { name } = req.body;

    // Create team
    const team = teamRepository.create({
      name,
      createdBy: userId
    });

    await teamRepository.save(team);

    // Add creator as team member with 'admin' role
    const teamMember = teamMemberRepository.create({
      teamId: team.id,
      userId,
      role: 'admin'
    });

    await teamMemberRepository.save(teamMember);

    res.status(201).json({
      message: 'Team created successfully',
      team
    });
  } catch (error) {
    console.error('Create team error:', error);
    res.status(500).json({ message: 'Error creating team' });
  }
};

export const getTeams = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      res.status(401).json({ message: 'User not authenticated' });
      return;
    }

    // Find all teams where user is a member
    const teamMembers = await teamMemberRepository.find({
      where: { userId },
      relations: ['team']
    });

    const teams = teamMembers.map(member => member.team);

    res.json(teams);
  } catch (error) {
    console.error('Get teams error:', error);
    res.status(500).json({ message: 'Error fetching teams' });
  }
};

export const getTeamMembers = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      res.status(401).json({ message: 'User not authenticated' });
      return;
    }

    const teamId = parseInt(req.params.id);

    // Check if user is a member of the team
    const userMembership = await teamMemberRepository.findOne({
      where: { teamId, userId }
    });

    if (!userMembership) {
      res.status(403).json({ message: 'Access denied' });
      return;
    }

    // Get all team members with user details
    const teamMembers = await teamMemberRepository.find({
      where: { teamId },
      relations: ['user']
    });

    const members = teamMembers.map(member => ({
      id: member.id,
      role: member.role,
      user: {
        id: member.user.id,
        firstName: member.user.firstName,
        lastName: member.user.lastName,
        email: member.user.email
      }
    }));

    res.json(members);
  } catch (error) {
    console.error('Get team members error:', error);
    res.status(500).json({ message: 'Error fetching team members' });
  }
};

export const inviteTeamMember = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      res.status(401).json({ message: 'User not authenticated' });
      return;
    }

    const teamId = parseInt(req.params.id);
    const { email, role = 'member' } = req.body;

    // Check if user is team admin
    const userMembership = await teamMemberRepository.findOne({
      where: { teamId, userId, role: 'admin' }
    });

    if (!userMembership) {
      res.status(403).json({ message: 'Only team admins can invite members' });
      return;
    }

    // Find user by email
    const invitedUser = await userRepository.findOne({
      where: { email }
    });

    if (!invitedUser) {
      res.status(404).json({ message: 'User not found' });
      return;
    }

    // Check if user is already a member
    const existingMember = await teamMemberRepository.findOne({
      where: { teamId, userId: invitedUser.id }
    });

    if (existingMember) {
      res.status(400).json({ message: 'User is already a team member' });
      return;
    }

    // Add new team member
    const teamMember = teamMemberRepository.create({
      teamId,
      userId: invitedUser.id,
      role
    });

    await teamMemberRepository.save(teamMember);

    res.status(201).json({
      message: 'Team member added successfully',
      teamMember: {
        id: teamMember.id,
        role: teamMember.role,
        user: {
          id: invitedUser.id,
          firstName: invitedUser.firstName,
          lastName: invitedUser.lastName,
          email: invitedUser.email
        }
      }
    });
  } catch (error) {
    console.error('Invite team member error:', error);
    res.status(500).json({ message: 'Error inviting team member' });
  }
};

export const removeTeamMember = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      res.status(401).json({ message: 'User not authenticated' });
      return;
    }

    const teamId = parseInt(req.params.id);
    const memberId = parseInt(req.params.memberId);

    // Check if user is team admin
    const userMembership = await teamMemberRepository.findOne({
      where: { teamId, userId, role: 'admin' }
    });

    if (!userMembership) {
      res.status(403).json({ message: 'Only team admins can remove members' });
      return;
    }

    // Find member to remove
    const memberToRemove = await teamMemberRepository.findOne({
      where: { id: memberId, teamId }
    });

    if (!memberToRemove) {
      res.status(404).json({ message: 'Team member not found' });
      return;
    }

    // Prevent removing the last admin
    if (memberToRemove.role === 'admin') {
      const adminCount = await teamMemberRepository.count({
        where: { teamId, role: 'admin' }
      });

      if (adminCount <= 1) {
        res.status(400).json({ message: 'Cannot remove the last admin' });
        return;
      }
    }

    await teamMemberRepository.remove(memberToRemove);
    res.json({ message: 'Team member removed successfully' });
  } catch (error) {
    console.error('Remove team member error:', error);
    res.status(500).json({ message: 'Error removing team member' });
  }
};