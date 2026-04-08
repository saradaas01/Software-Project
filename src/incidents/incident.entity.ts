import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { User } from '../users/user.entity';

@Entity('incidents')
export class Incident {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: true })
  checkpoint_id: string;

  @Column({ length: 255 })
  title: string;

  @Column({ type: 'text' })
  description: string;

  @Column({ type: 'enum', enum: ['closure', 'delay', 'accident', 'weather_hazard', 'checkpoint'], default: 'delay' })
  type: string;

  @Column({ type: 'enum', enum: ['low', 'medium', 'high', 'critical'], default: 'medium' })
  severity: string;

  @Column({ type: 'enum', enum: ['active', 'verified', 'closed'], default: 'active' })
  status: string;

  @Column({ type: 'decimal', precision: 9, scale: 6 })
  latitude: number;

  @Column({ type: 'decimal', precision: 9, scale: 6 })
  longitude: number;

  @Column({ nullable: true, length: 100 })
  region: string;

  @Column({ nullable: true })
  reported_by: string;

  @Column({ nullable: true })
  verified_by: string;

  @Column({ type: 'timestamp', nullable: true })
  verified_at: Date;

  @Column({ type: 'timestamp', nullable: true })
  resolved_at: Date;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}