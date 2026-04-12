import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Checkpoint } from './checkpoint.entity';
import { CheckpointStatusHistoryService } from '../checkpoint-status-history/checkpoint-status-history.service';

@Injectable()
export class CheckpointsService {
  constructor(
    @InjectRepository(Checkpoint)
    private checkpointsRepository: Repository<Checkpoint>,
    private checkpointStatusHistoryService: CheckpointStatusHistoryService,
  ) {}

  async findAll(region?: string, type?: string, page = 1, limit = 10) {
    const query = this.checkpointsRepository.createQueryBuilder('checkpoint');
    if (region) query.andWhere('checkpoint.region = :region', { region });
    if (type) query.andWhere('checkpoint.type = :type', { type });
    query.orderBy('checkpoint.created_at', 'DESC');
    query.skip((page - 1) * limit).take(limit);
    const [data, total] = await query.getManyAndCount();
    return { data, total, page, limit };
  }

  async findOne(id: string) {
    const checkpoint = await this.checkpointsRepository.findOne({ where: { id } });
    if (!checkpoint) throw new NotFoundException('Checkpoint not found');
    return checkpoint;
  }

  async create(dto: Partial<Checkpoint>) {
    const checkpoint = this.checkpointsRepository.create(dto);
    return await this.checkpointsRepository.save(checkpoint);
  }

  async update(id: string, dto: Partial<Checkpoint>) {
    const old = await this.findOne(id);
    if (dto.is_active !== undefined && dto.is_active !== old.is_active) {
      await this.checkpointStatusHistoryService.create({
        checkpoint_id: id,
        status: dto.is_active ? 'open' : 'closed',
        notes: 'Status changed',
      });
    }
    await this.checkpointsRepository.update(id, dto);
    return this.findOne(id);
  }

  async remove(id: string) {
    await this.findOne(id);
    await this.checkpointsRepository.delete(id);
    return { message: 'Checkpoint deleted successfully' };
  }

  async getHistory(checkpoint_id: string) {
    return await this.checkpointStatusHistoryService.findByCheckpoint(checkpoint_id);
  }
}