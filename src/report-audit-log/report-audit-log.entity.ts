import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity('report_audit_log')
export class ReportAuditLog {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  report_id: string;

  @Column()
  performed_by: string;

  @Column({ length: 50 })
  action: string;

  @Column({ type: 'text', nullable: true })
  reason: string;

  @Column({ type: 'jsonb', nullable: true })
  metadata: object;

  @CreateDateColumn()
  performed_at: Date;
}