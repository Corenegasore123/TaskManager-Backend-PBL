import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { User } from './User';

export type TaskStatus = 'todo' | 'ongoing' | 'done';
export type TaskPriority = 'low' | 'medium' | 'high';

@Entity('tasks')
export class Task {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  title!: string;

  @Column({ nullable: true })
  description!: string;

  @Column({
    type: 'enum',
    enum: ['todo', 'ongoing', 'done'],
    default: 'todo'
  })
  status!: TaskStatus;

  @Column({
    type: 'enum',
    enum: ['low', 'medium', 'high'],
    default: 'medium'
  })
  priority!: TaskPriority;

  @Column({ type: 'timestamp with time zone', nullable: true })
  deadline!: Date | null;

  @Column({ name: 'user_id' })
  userId!: number;

  @ManyToOne(() => User, (user: User) => user.tasks)
  @JoinColumn({ name: 'user_id' })
  user!: User;

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt!: Date;
} 