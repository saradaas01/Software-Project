import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { IncidentsModule } from './incidents/incidents.module';
import { CheckpointsModule } from './checkpoints/checkpoints.module';
import { IncidentStatusHistoryModule } from './incident-status-history/incident-status-history.module';
import { IncidentStatusHistorynpxService } from './nest/incident-status-historynpx/incident-status-historynpx.service';
import { CheckpointStatusHistoryModule } from './checkpoint-status-history/checkpoint-status-history.module';
import { ReportsModule } from './reports/reports.module';
import { ReportVotesModule } from './report-votes/report-votes.module';
import { ReportAuditLogModule } from './report-audit-log/report-audit-log.module';
import { AlertSubscriptionsModule } from './alert-subscriptions/alert-subscriptions.module';
import { AlertRecordsModule } from './alert-records/alert-records.module';
import { RouteCacheModule } from './route-cache/route-cache.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'postgres',
        host: config.get('DB_HOST'),
        port: parseInt(config.get('DB_PORT') ?? '5432'),
        username: config.get('DB_USERNAME'),
        password: config.get('DB_PASSWORD'),
        database: config.get('DB_NAME'),
        autoLoadEntities: true,
        synchronize: true,
      }),
    }),
    AuthModule,
    UsersModule,
    IncidentsModule,
    CheckpointsModule,
    IncidentStatusHistoryModule,
    CheckpointStatusHistoryModule,
    ReportsModule,
    ReportVotesModule,
    ReportAuditLogModule,
    AlertSubscriptionsModule,
    AlertRecordsModule,
    RouteCacheModule,
  ],
  providers: [IncidentStatusHistorynpxService],
})
export class AppModule {}