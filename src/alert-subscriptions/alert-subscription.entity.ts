import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity('alert_subscriptions')
export class AlertSubscription {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  user_id: string;

  @Column({ length: 100, nullable: true })
  region: string;

  @Column({ type: 'enum', enum: ['closure', 'delay', 'accident', 'weather_hazard', 'checkpoint'], nullable: true })
  category: string;

  @Column({ default: true })
  is_active: boolean;

  @CreateDateColumn()
  created_at: Date;
}