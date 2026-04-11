import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity('reports')
export class Report {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  user_id!: string;

  @Column({ nullable: true })
  duplicate_of!: string;

  @Column({ type: 'decimal', precision: 9, scale: 6 })
  latitude!: number;

  @Column({ type: 'decimal', precision: 9, scale: 6 })
  longitude!: number;

  @Column({
    type: 'enum',
    enum: ['closure', 'delay', 'accident', 'weather_hazard', 'checkpoint'],
    default: 'delay',
  })
  category!: string;

  @Column({ type: 'text' })
  description!: string;

  @Column({
    type: 'enum',
    enum: ['pending', 'verified', 'rejected', 'duplicate'],
    default: 'pending',
  })
  status!: string;

  @Column({ type: 'decimal', precision: 3, scale: 2, default: 0 })
  confidence_score!: number;

  @Column({ length: 100, nullable: true })
  region!: string;

  @CreateDateColumn()
  created_at!: Date;
}