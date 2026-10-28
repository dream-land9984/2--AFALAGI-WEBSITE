import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';

export enum ReportStatus {
  MISSING = 'MISSING',
  FOUND = 'FOUND',
  REUNITED = 'REUNITED',
}

@Entity('reports')
export class Report {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 150 })
  name: string;

  @Column({ type: 'int' })
  age: number;

  @Column({ type: 'varchar', length: 20, default: 'Not specified' })
  gender: string;

  @Column({ type: 'varchar', length: 150 })
  location: string;

  @Column({ type: 'varchar', length: 50, name: 'date_lost' })
  dateLost: string;

  @Column({ type: 'text' })
  description: string;

  @Column({ type: 'varchar', length: 100 })
  contact: string;

  @Column({ type: 'varchar', length: 500, nullable: true })
  image: string;

  @Column({
    type: 'enum',
    enum: ReportStatus,
    default: ReportStatus.MISSING,
  })
  status: ReportStatus;

  @ManyToOne(() => User, (user) => user.reports, {
    nullable: true,
    onDelete: 'SET NULL',
  })
  @JoinColumn({ name: 'reporter_id' })
  reporter?: User | null;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
