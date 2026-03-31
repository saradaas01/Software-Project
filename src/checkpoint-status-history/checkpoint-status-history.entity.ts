import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity('checkpoint_status_history')
export class CheckpointStatusHistory {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  checkpoint_id: string;

  @Column({ nullable: true })
  recorded_by: string;

  @Column({ type: 'enum', enum: ['open', 'closed', 'delayed', 'unknown'], default: 'unknown' })
  status: string;

  @Column({ type: 'text', nullable: true })
  notes: string;

  @CreateDateColumn()
  recorded_at: Date;
}