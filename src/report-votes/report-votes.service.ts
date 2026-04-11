import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ReportVote } from './report-vote.entity';
import { CreateReportVoteDto } from './dto/create-report-vote.dto';
import { Report } from '../reports/report.entity';

@Injectable()
export class ReportVotesService {
  constructor(
    @InjectRepository(ReportVote)
    private readonly reportVoteRepository: Repository<ReportVote>,

    @InjectRepository(Report)
    private readonly reportRepository: Repository<Report>,
  ) {}

  async create(reportId: string, dto: CreateReportVoteDto) {
    const report = await this.reportRepository.findOne({
      where: { id: reportId },
    });

    if (!report) {
      throw new NotFoundException('Report not found');
    }

    const existingVote = await this.reportVoteRepository.findOne({
      where: {
        report_id: reportId,
        user_id: dto.user_id,
      },
    });

    let message = 'Vote created successfully';

    if (existingVote) {
      existingVote.vote = dto.vote;
      await this.reportVoteRepository.save(existingVote);
      message = 'Vote updated successfully';
    } else {
      const vote = this.reportVoteRepository.create({
        report_id: reportId,
        user_id: dto.user_id,
        vote: dto.vote,
      });

      await this.reportVoteRepository.save(vote);
    }

    const { confidenceScore, votesCount } = await this.updateConfidenceScore(reportId);
    await this.applyAutoModeration(reportId, confidenceScore, votesCount);

    const updatedReport = await this.reportRepository.findOne({
      where: { id: reportId },
    });

    return {
      message,
      confidence_score: confidenceScore,
      votes_count: votesCount,
      status: updatedReport?.status,
    };
  }

  async findAll() {
    return await this.reportVoteRepository.find();
  }

  private async updateConfidenceScore(reportId: string) {
    const votes = await this.reportVoteRepository.find({
      where: { report_id: reportId },
    });

    if (votes.length === 0) {
      await this.reportRepository.update(reportId, {
        confidence_score: 0,
      });

      return {
        confidenceScore: 0,
        votesCount: 0,
      };
    }

    const positiveVotes = votes.filter((vote) => vote.vote === 1).length;
    const confidenceScore = positiveVotes / votes.length;
    const roundedScore = Number(confidenceScore.toFixed(2));

    await this.reportRepository.update(reportId, {
      confidence_score: roundedScore,
    });

    return {
      confidenceScore: roundedScore,
      votesCount: votes.length,
    };
  }
private async applyAutoModeration(
  reportId: string,
  confidenceScore: number,
  votesCount: number,
) {
  if (votesCount < 3) {
    return;
  }

  const report = await this.reportRepository.findOne({
    where: { id: reportId },
  });

  if (!report) {
    return;
  }

  if (report.status === 'pending') {
    if (confidenceScore >= 0.8) {
      report.status = 'verified';
    } else if (confidenceScore <= 0.3) {
      report.status = 'rejected';
    }
  } else if (report.status === 'verified' && confidenceScore <= 0.3) {
    report.status = 'rejected';
  } else if (report.status === 'rejected' && confidenceScore >= 0.8) {
    report.status = 'verified';
  }

  await this.reportRepository.save(report);
}
}