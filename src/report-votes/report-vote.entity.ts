import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity('report_votes')
export class ReportVote {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  report_id!: string;

  @Column()
  user_id!: string;

  @Column({ type: 'smallint' })
  vote!: number;

  @CreateDateColumn()
  created_at!: Date;
}