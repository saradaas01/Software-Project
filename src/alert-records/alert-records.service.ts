import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AlertRecord } from './alert-record.entity';

@Injectable()
export class AlertRecordsService {
  constructor(
    @InjectRepository(AlertRecord)
    private alertRecordsRepository: Repository<AlertRecord>,
  ) {}

  async create(data: Partial<AlertRecord>) {
    const record = this.alertRecordsRepository.create(data);
    return await this.alertRecordsRepository.save(record);
  }

  async findByUser(user_id: string) {
    return await this.alertRecordsRepository.find({
      where: { user_id },
      order: { sent_at: 'DESC' },
    });
  }

  async markAsRead(id: string) {
    await this.alertRecordsRepository.update(id, { is_read: true });
    return { message: 'Alert marked as read' };
  }
}