import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Subscription } from './entities/subscription.entity';
import { Alert } from './entities/alert.entity';
import { CreateSubscriptionDto } from './dto/create-subscription.dto';

@Injectable()
export class AlertsService {
  constructor(
    @InjectRepository(Subscription)
    private subscriptionRepo: Repository<Subscription>,

    @InjectRepository(Alert)
    private alertRepo: Repository<Alert>,
  ) {}

  async createSubscription(userId: number, dto: CreateSubscriptionDto) {
    const sub = this.subscriptionRepo.create({ ...dto, userId });
    return this.subscriptionRepo.save(sub);
  }

  async getUserSubscriptions(userId: number) {
    return this.subscriptionRepo.find({
      where: { userId, is_active: true },
      order: { created_at: 'DESC' },
    });
  }

  async deleteSubscription(userId: number, subId: number) {
    const sub = await this.subscriptionRepo.findOne({
      where: { id: subId, userId },
    });
    if (!sub) throw new NotFoundException('Subscription not found');
    await this.subscriptionRepo.update(subId, { is_active: false });
    return { message: 'Subscription cancelled' };
  }

  async getUserAlerts(userId: number, page = 1, limit = 20) {
    const [data, total] = await this.alertRepo.findAndCount({
      where: { userId },
      order: { created_at: 'DESC' },
      skip: (page - 1) * limit,
      take: limit,
    });
    return { data, total, page, limit };
  }

  async markAsRead(userId: number, alertId: number) {
    const alert = await this.alertRepo.findOne({
      where: { id: alertId, userId },
    });
    if (!alert) throw new NotFoundException('Alert not found');
    await this.alertRepo.update(alertId, { is_read: true });
    return { message: 'Alert marked as read' };
  }

  async triggerAlertsForIncident(incident: {
    id: number;
    category: string;
    description: string;
    latitude: number;
    longitude: number;
  }) {
    const subscriptions = await this.subscriptionRepo.find({
      where: { is_active: true },
    });

    const alertsToCreate: Alert[] = [];

    for (const sub of subscriptions) {
      const categoryMatch = !sub.category || sub.category === incident.category;
      const geoMatch = this.isWithinRadius(
        incident.latitude,
        incident.longitude,
        sub.latitude,
        sub.longitude,
        sub.radius_km,
      );

      if (categoryMatch && geoMatch) {
        alertsToCreate.push(
          this.alertRepo.create({
            incidentId: incident.id,
            subscriptionId: sub.id,
            userId: sub.userId,
            message: `New ${incident.category} near ${sub.area_name}: ${incident.description}`,
          }),
        );
      }
    }

    if (alertsToCreate.length > 0) {
      await this.alertRepo.save(alertsToCreate);
    }

    return { triggered: alertsToCreate.length };
  }

  private isWithinRadius(
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number,
    radiusKm: number,
  ): boolean {
    if (!lat1 || !lon1 || !lat2 || !lon2 || !radiusKm) return false;
    const R = 6371;
    const dLat = this.toRad(lat2 - lat1);
    const dLon = this.toRad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) ** 2 +
      Math.cos(this.toRad(lat1)) *
        Math.cos(this.toRad(lat2)) *
        Math.sin(dLon / 2) ** 2;
    const distance = R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return distance <= radiusKm;
  }

  private toRad(deg: number): number {
    return deg * (Math.PI / 180);
  }
}