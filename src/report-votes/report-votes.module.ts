import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ReportVote } from './report-vote.entity';
import { Report } from '../reports/report.entity';
import { ReportVotesController } from './report-votes.controller';
import { ReportVotesService } from './report-votes.service';

@Module({
  imports: [TypeOrmModule.forFeature([ReportVote, Report])],
  controllers: [ReportVotesController],
  providers: [ReportVotesService],
})
export class ReportVotesModule {}