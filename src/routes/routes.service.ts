import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RouteCache } from 'src/route-cache/route-cache.entity';
import { OsmService } from '../integrations/osm/osm.service';
import { WeatherService } from '../integrations/weather/weather.service';
import { from } from 'rxjs';

@Injectable()
export class RoutesService {

    constructor(
        @InjectRepository(RouteCache)
        private routeCacheRepo: Repository<RouteCache>,
        private osmService: OsmService,
        private weatherService: WeatherService
    ) { }

    async estimateRoute(
        originLat: number,
        originLng: number,
        destLat: number,
        destLng: number,
        avoidCheckpoints: boolean = false,
    ) {

        const cached = await this.routeCacheRepo.findOne({
            where: {
                origin_lat: originLat,
                origin_lng: originLng,
                dest_lat: destLat,
                dest_lng: destLng,
                avoid_checkpoints: avoidCheckpoints,
            }
        });

        if (cached && new Date() < cached.expires_at) {
            return {
                cached,
                from_cache: true,
            };
        }

        const [routeData, weatherData] = await Promise.all([
            this.osmService.getRout(originLat, originLng, destLat, destLng),
            this.weatherService.getWeather(originLat, originLng),
        ]);

        const factors: string[] = [];
        if (weatherData.warning) factors.push(weatherData.warning);
        if (avoidCheckpoints) factors.push('check point avoidance applied');

        const metadata = {
            weather: weatherData,
            factors,
            waypoints: routeData.waypoints,
        };

        const expires_at = new Date(Date.now() + 30 * 60 * 1000);

        const routeCache = this.routeCacheRepo.create({
            origin_lat: originLat,
            origin_lng: originLng,
            dest_lat: destLat,
            dest_lng: destLng,
            avoid_checkpoints: avoidCheckpoints,
            distance_meters: routeData.distance_meters,
            duration_seconds: routeData.duration_seconds,
            metadata,
            expires_at,
        });

        await this.routeCacheRepo.save(routeCache);

        return {
            distance_meters: routeData.distance_meters,
            duration_seconds: routeData.duration_seconds,
            metadata,
            from_cache: false,
        };

    }

}
