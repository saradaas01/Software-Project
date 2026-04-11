import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { ReportVotesService } from './report-votes.service';
import { CreateReportVoteDto } from './dto/create-report-vote.dto';

@Controller('api/v1/reports')
export class ReportVotesController {
  constructor(private readonly reportVotesService: ReportVotesService) {}

  @Post(':id/vote')
  createVote(
    @Param('id') reportId: string,
    @Body() dto: CreateReportVoteDto,
  ) {
    return this.reportVotesService.create(reportId, dto);
  }

  @Get('votes/all')
  findAll() {
    return this.reportVotesService.findAll();
  }
}