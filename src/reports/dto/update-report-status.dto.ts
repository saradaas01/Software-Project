import { IsString } from 'class-validator';

export class UpdateReportStatusDto {
  @IsString()
  performed_by!: string;
}