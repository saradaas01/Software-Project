import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Incident } from './incident.entity';

@Injectable()
export class IncidentsService {
  constructor(
    @InjectRepository(Incident)
    private incidentsRepository: Repository<Incident>,
  ) {}

  async findAll(type?: string, severity?: string, status?: string, page = 1, limit = 10) {
    const query = this.incidentsRepository.createQueryBuilder('incident');
    if (type) query.andWhere('incident.type = :type', { type });
    if (severity) query.andWhere('incident.severity = :severity', { severity });
    if (status) query.andWhere('incident.status = :status', { status });
    query.orderBy('incident.created_at', 'DESC');
    query.skip((page - 1) * limit).take(limit);
    const [data, total] = await query.getManyAndCount();
    return { data, total, page, limit };
  }

  async findOne(id: string) {
    const incident = await this.incidentsRepository.findOne({ where: { id } });
    if (!incident) throw new NotFoundException('Incident not found');
    return incident;
  }

  async create(dto: Partial<Incident>) {
    const incident = this.incidentsRepository.create(dto);
    return await this.incidentsRepository.save(incident);
  }

  async update(id: string, dto: Partial<Incident>) {
    await this.findOne(id);
    await this.incidentsRepository.update(id, dto);
    return this.findOne(id);
  }

  async remove(id: string) {
    await this.findOne(id);
    await this.incidentsRepository.delete(id);
    return { message: 'Incident deleted successfully' };
  }
}