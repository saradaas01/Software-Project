import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RouteCache } from './route-cache.entity';

@Injectable()
export class RouteCacheService {
  constructor(
    @InjectRepository(RouteCache)
    private routeCacheRepository: Repository<RouteCache>,
  ) {}

  async create(data: Partial<RouteCache>) {
    const route = this.routeCacheRepository.create(data);
    return await this.routeCacheRepository.save(route);
  }

  async findRoute(origin_lat: number, origin_lng: number, dest_lat: number, dest_lng: number) {
    return await this.routeCacheRepository.findOne({
      where: { origin_lat, origin_lng, dest_lat, dest_lng },
    });
  }
}