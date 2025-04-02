import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, OneToMany, JoinColumn } from 'typeorm';
import { User } from './User';
import { TeamMember } from './TeamMember';

@Entity('teams')
export class Team {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  name!: string;

  @Column({ name: 'created_by' })
  createdBy!: number;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'created_by' })
  creator!: User;

  @OneToMany(() => TeamMember, (teamMember: TeamMember) => teamMember.team)
  members!: TeamMember[];

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;
} 