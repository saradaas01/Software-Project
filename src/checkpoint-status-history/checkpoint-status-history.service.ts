import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CheckpointStatusHistory } from './checkpoint-status-history.entity';

@Injectable()
export class CheckpointStatusHistoryService {
  constructor(
    @InjectRepository(CheckpointStatusHistory)
    private historyRepository: Repository<CheckpointStatusHistory>,
  ) {}

  async create(data: Partial<CheckpointStatusHistory>) {
    const record = this.historyRepository.create(data);
    return await this.historyRepository.save(record);
  }

  async findByCheckpoint(checkpoint_id: string) {
    return await this.historyRepository.find({
      where: { checkpoint_id },
      order: { recorded_at: 'DESC' },
    });
  }
}