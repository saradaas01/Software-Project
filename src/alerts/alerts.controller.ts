import {
  Controller,
  Get,
  Post,
  Delete,
  Patch,
  Body,
  Param,
  Query,
  UseGuards,
  Req,
} from '@nestjs/common';
import { AlertsService } from './alerts.service';
import { CreateSubscriptionDto } from './dto/create-subscription.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('api/v1/alerts')
export class AlertsController {
  constructor(private readonly alertsService: AlertsService) {}

  // ─── Subscriptions ───────────────────────────────────────────

  // POST /api/v1/alerts/subscriptions
  @Post('subscriptions')
  createSubscription(@Req() req, @Body() dto: CreateSubscriptionDto) {
    return this.alertsService.createSubscription(req.user.id, dto);
  }

  // GET /api/v1/alerts/subscriptions
  @Get('subscriptions')
  getMySubscriptions(@Req() req) {
    return this.alertsService.getUserSubscriptions(req.user.id);
  }

  // DELETE /api/v1/alerts/subscriptions/:id
  @Delete('subscriptions/:id')
  deleteSubscription(@Req() req, @Param('id') id: number) {
    return this.alertsService.deleteSubscription(req.user.id, +id);
  }

  // ─── Alerts ──────────────────────────────────────────────────

  // GET /api/v1/alerts
  @Get()
  getMyAlerts(
    @Req() req,
    @Query('page') page = 1,
    @Query('limit') limit = 20,
  ) {
    return this.alertsService.getUserAlerts(req.user.id, +page, +limit);
  }

  // PATCH /api/v1/alerts/:id/read
  @Patch(':id/read')
  markAsRead(@Req() req, @Param('id') id: number) {
    return this.alertsService.markAsRead(req.user.id, +id);
  }
}