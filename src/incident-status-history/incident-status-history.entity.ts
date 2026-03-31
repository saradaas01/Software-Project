import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Incident } from '../incidents/incident.entity';
import { User } from '../users/user.entity';

@Entity('incident_status_history')
export class IncidentStatusHistory {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  incident_id: string;

  @Column({ nullable: true })
  changed_by: string;

  @Column({ type: 'enum', enum: ['active', 'verified', 'closed'] })
  old_status: string;

  @Column({ type: 'enum', enum: ['active', 'verified', 'closed'] })
  new_status: string;

  @Column({ type: 'text', nullable: true })
  reason: string;

  @CreateDateColumn()
  changed_at: Date;
}