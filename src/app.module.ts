import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { IncidentsModule } from './incidents/incidents.module';
import { ReportsModule } from './reports/reports.module';
import { ReportVotesModule } from './report-votes/report-votes.module';

import { User } from './users/user.entity';
import { RefreshToken } from './auth/refresh-token.entity';
import { Incident } from './incidents/incident.entity';
import { Checkpoint } from './checkpoints/checkpoint.entity';
import { CheckpointStatusHistory } from './checkpoint-status-history/checkpoint-status-history.entity';
import { IncidentStatusHistory } from './incident-status-history/incident-status-history.entity';
import { Report } from './reports/report.entity';
import { ReportVote } from './report-votes/report-vote.entity';
import { ReportAuditLog } from './report-audit-log/report-audit-log.entity';
import { AlertSubscription } from './alert-subscriptions/alert-subscription.entity';
import { AlertRecord } from './alert-records/alert-record.entity';
import { RouteCache } from './route-cache/route-cache.entity';

import { CheckpointsModule } from './checkpoints/checkpoints.module';
import { IncidentStatusHistoryModule } from './incident-status-history/incident-status-history.module';
import { CheckpointStatusHistoryModule } from './checkpoint-status-history/checkpoint-status-history.module';
import { RoutesModule } from './routes/routes.module';
import { IntegrationsModule } from './integrations/integrations.module';

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
        synchronize: true,
        entities: [
          User,
          RefreshToken,
          Incident,
          Checkpoint,
          CheckpointStatusHistory,
          IncidentStatusHistory,
          Report,
          ReportVote,
          ReportAuditLog,
          AlertSubscription,
          AlertRecord,
          RouteCache,
        ],
      }),
    }),
    AuthModule,
    UsersModule,
    IncidentsModule,
    ReportsModule,
    ReportVotesModule,
    CheckpointsModule,
    IncidentStatusHistoryModule,
    CheckpointStatusHistoryModule,
    RoutesModule,
    IntegrationsModule,
  ],
})
export class AppModule {}