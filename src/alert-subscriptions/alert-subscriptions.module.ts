import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AlertSubscriptionsService } from './alert-subscriptions.service';
import { AlertSubscription } from './alert-subscription.entity';

@Module({
  imports: [TypeOrmModule.forFeature([AlertSubscription])],
  providers: [AlertSubscriptionsService],
  exports: [AlertSubscriptionsService],
})
export class AlertSubscriptionsModule {}