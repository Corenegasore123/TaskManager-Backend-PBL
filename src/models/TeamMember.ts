import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { User } from './User';
import { Team } from './Team';

@Entity('team_members')
export class TeamMember {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ name: 'team_id' })
  teamId!: number;

  @Column({ name: 'user_id' })
  userId!: number;

  @Column({ default: 'member' })
  role!: string;

  @ManyToOne(() => Team, (team: Team) => team.members)
  @JoinColumn({ name: 'team_id' })
  team!: Team;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  user!: User;

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;
}