import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AlertSubscription } from './alert-subscription.entity';

@Injectable()
export class AlertSubscriptionsService {
  constructor(
    @InjectRepository(AlertSubscription)
    private subscriptionsRepository: Repository<AlertSubscription>,
  ) {}

  async create(data: Partial<AlertSubscription>) {
    const subscription = this.subscriptionsRepository.create(data);
    return await this.subscriptionsRepository.save(subscription);
  }

  async findByUser(user_id: string) {
    return await this.subscriptionsRepository.find({ where: { user_id } });
  }

  async remove(id: string) {
    await this.subscriptionsRepository.delete(id);
    return { message: 'Subscription deleted successfully' };
  }
}