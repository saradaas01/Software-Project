import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { IncidentStatusHistory } from './incident-status-history.entity';

@Injectable()
export class IncidentStatusHistoryService {
  constructor(
    @InjectRepository(IncidentStatusHistory)
    private historyRepository: Repository<IncidentStatusHistory>,
  ) {}

  async create(data: Partial<IncidentStatusHistory>) {
    const record = this.historyRepository.create(data);
    return await this.historyRepository.save(record);
  }

  async findByIncident(incident_id: string) {
    return await this.historyRepository.find({
      where: { incident_id },
      order: { changed_at: 'DESC' },
    });
  }
}