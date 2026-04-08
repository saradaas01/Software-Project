import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity('alert_records')
export class AlertRecord {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  incident_id: string;

  @Column()
  subscription_id: string;

  @Column()
  user_id: string;

  @Column({ length: 255 })
  title: string;

  @Column({ type: 'text' })
  message: string;

  @Column({ default: false })
  is_read: boolean;

  @CreateDateColumn()
  sent_at: Date;
}