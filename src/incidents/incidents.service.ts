import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Incident } from './incident.entity';
import { IncidentStatusHistoryService } from '../incident-status-history/incident-status-history.service';

@Injectable()
export class IncidentsService {
  constructor(
    @InjectRepository(Incident)
    private incidentsRepository: Repository<Incident>,
    private incidentStatusHistoryService: IncidentStatusHistoryService,
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
    const old = await this.findOne(id);
    if (dto.status && dto.status !== old.status) {
      await this.incidentStatusHistoryService.create({
        incident_id: id,
        old_status: old.status,
        new_status: dto.status,
      });
    }
    await this.incidentsRepository.update(id, dto);
    return this.findOne(id);
  }

  async remove(id: string) {
    await this.findOne(id);
    await this.incidentsRepository.delete(id);
    return { message: 'Incident deleted successfully' };
  }

  async getHistory(incident_id: string) {
    return await this.incidentStatusHistoryService.findByIncident(incident_id);
  }

  async verify(id: string, reason?: string) {
    const incident = await this.findOne(id);
    if (incident.status === 'verified') throw new BadRequestException('Incident already verified');
    await this.incidentStatusHistoryService.create({
      incident_id: id,
      old_status: incident.status,
      new_status: 'verified',
      reason,
    });
    await this.incidentsRepository.update(id, { status: 'verified', verified_at: new Date() });
    return this.findOne(id);
  }

  async close(id: string, reason?: string) {
    const incident = await this.findOne(id);
    if (incident.status === 'closed') throw new BadRequestException('Incident already closed');
    await this.incidentStatusHistoryService.create({
      incident_id: id,
      old_status: incident.status,
      new_status: 'closed',
      reason,
    });
    await this.incidentsRepository.update(id, { status: 'closed', resolved_at: new Date() });
    return this.findOne(id);
  }

  async resolve(id: string, reason?: string) {
    const incident = await this.findOne(id);
    if (incident.status === 'closed') throw new BadRequestException('Incident already resolved');
    await this.incidentStatusHistoryService.create({
      incident_id: id,
      old_status: incident.status,
      new_status: 'closed',
      reason,
    });
    await this.incidentsRepository.update(id, { status: 'closed', resolved_at: new Date() });
    return this.findOne(id);
  }
}