import express from 'express';
import {
  createTeam,
  getTeams,
  getTeamMembers,
  inviteTeamMember,
  removeTeamMember
} from '../controllers/team.controller';
import { authenticateToken } from '../middleware/auth.middleware';
import { AsyncRequestHandler } from '../types/express';

const router = express.Router();

/**
 * @swagger
 * /api/teams:
 *   post:
 *     summary: Create a new team
 *     tags: [Teams]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *             properties:
 *               name:
 *                 type: string
 *     responses:
 *       201:
 *         description: Team created successfully
 *       401:
 *         description: Unauthorized
 */
router.post('/', authenticateToken, createTeam as AsyncRequestHandler);

/**
 * @swagger
 * /api/teams:
 *   get:
 *     summary: Get all teams for the authenticated user
 *     tags: [Teams]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of teams
 *       401:
 *         description: Unauthorized
 */
router.get('/', authenticateToken, getTeams as AsyncRequestHandler);

/**
 * @swagger
 * /api/teams/{teamId}/members:
 *   get:
 *     summary: Get all members of a team
 *     tags: [Teams]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: teamId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: List of team members
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Team not found
 */
router.get('/:teamId/members', authenticateToken, getTeamMembers as AsyncRequestHandler);

/**
 * @swagger
 * /api/teams/{teamId}/members:
 *   post:
 *     summary: Invite a user to join the team
 *     tags: [Teams]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: teamId
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - userId
 *             properties:
 *               userId:
 *                 type: integer
 *               role:
 *                 type: string
 *                 enum: [admin, member]
 *     responses:
 *       200:
 *         description: User invited successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Not authorized to invite members
 *       404:
 *         description: Team or user not found
 */
router.post('/:teamId/members', authenticateToken, inviteTeamMember as AsyncRequestHandler);

/**
 * @swagger
 * /api/teams/{teamId}/members/{userId}:
 *   delete:
 *     summary: Remove a member from the team
 *     tags: [Teams]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: teamId
 *         required: true
 *         schema:
 *           type: integer
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Member removed successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Not authorized to remove members
 *       404:
 *         description: Team or user not found
 */
router.delete('/:teamId/members/:userId', authenticateToken, removeTeamMember as AsyncRequestHandler);

export default router; 