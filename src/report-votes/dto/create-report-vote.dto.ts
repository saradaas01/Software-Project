import { IsIn, IsString } from 'class-validator';

export class CreateReportVoteDto {
  @IsString()
  user_id!: string;

  @IsIn([0, 1])
  vote!: number;
}