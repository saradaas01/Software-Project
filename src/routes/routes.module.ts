import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RoutesController } from './routes.controller';
import { RoutesService } from './routes.service';
import { RouteCache } from 'src/route-cache/route-cache.entity';
import { IntegrationsModule } from '../integrations/integrations.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([RouteCache]),
    IntegrationsModule,
  ],
  providers: [RoutesService],
  controllers: [RoutesController]
})
export class RoutesModule { }
