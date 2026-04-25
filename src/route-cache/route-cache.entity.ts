import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity('route_cache')
export class RouteCache {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'decimal', precision: 9, scale: 6 })
  origin_lat!: number;

  @Column({ type: 'decimal', precision: 9, scale: 6 })
  origin_lng!: number;

  @Column({ type: 'decimal', precision: 9, scale: 6 })
  dest_lat!: number;

  @Column({ type: 'decimal', precision: 9, scale: 6 })
  dest_lng!: number;

  @Column({ default: false })
  avoid_checkpoints!: boolean;

  @Column({ type: 'text', nullable: true })
  avoid_areas_key!: string;

  @Column({ type: 'integer', nullable: true })
  distance_meters!: number;

  @Column({ type: 'integer', nullable: true })
  duration_seconds!: number;

  @Column({ type: 'jsonb', nullable: true })
  metadata!: object;

  @Column({ type: 'timestamp', nullable: true })
  expires_at!: Date;

  @CreateDateColumn()
  created_at!: Date;
}