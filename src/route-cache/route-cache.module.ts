import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RouteCacheService } from './route-cache.service';
import { RouteCache } from './route-cache.entity';

@Module({
  imports: [TypeOrmModule.forFeature([RouteCache])],
  providers: [RouteCacheService],
  exports: [RouteCacheService],
})
export class RouteCacheModule {}