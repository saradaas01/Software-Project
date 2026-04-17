import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RouteCache } from 'src/route-cache/route-cache.entity';
import { OsmService } from '../integrations/osm/osm.service';
import {
    WeatherService,
    WeatherResult,
} from '../integrations/weather/weather.service';
import { Checkpoint } from 'src/checkpoints/checkpoint.entity';

@Injectable()
export class RoutesService {
    constructor(
        @InjectRepository(RouteCache)
        private routeCacheRepo: Repository<RouteCache>,

        @InjectRepository(Checkpoint)
        private checkpointRepo: Repository<Checkpoint>,

        private osmService: OsmService,
        private weatherService: WeatherService,
    ) { }

    async estimateRoute(
        originLat: number,
        originLng: number,
        destLat: number,
        destLng: number,
        avoidCheckpoints: boolean = false,
        avoidAreas: string[] = [],
    ) {
        const avoidAreasKey = this.buildAvoidAreasKey(avoidAreas);

        const cached = await this.routeCacheRepo.findOne({
            where: {
                origin_lat: originLat,
                origin_lng: originLng,
                dest_lat: destLat,
                dest_lng: destLng,
                avoid_checkpoints: avoidCheckpoints,
                avoid_areas_key: avoidAreasKey,
            },
        });

        if (cached && cached.expires_at && new Date() < cached.expires_at) {
            return {
                distance_meters: cached.distance_meters,
                duration_seconds: cached.duration_seconds,
                metadata: cached.metadata,
                from_cache: true,
            };
        }

        const routeData = await this.osmService.getRoute(
            originLat,
            originLng,
            destLat,
            destLng,
        );

        let weatherData: WeatherResult | null = null;

        try {
            weatherData = await this.weatherService.getWeather(originLat, originLng);
        } catch {
            weatherData = null;
        }

        const factors: string[] = [];

        if (weatherData?.warning) {
            factors.push(weatherData.warning);
        }

        const activeCheckpoints = await this.checkpointRepo.find({
            where: { is_active: true },
        });

        const nearbyCheckpoints = this.findNearbyCheckpoints(
            routeData.coordinates,
            activeCheckpoints,
            2000,
        );

        const normalizedAvoidAreas = avoidAreas.map((area) =>
            this.normalizeText(area),
        );

        const affectedAvoidAreaCheckpoints = nearbyCheckpoints.filter((cp) =>
            normalizedAvoidAreas.includes(this.normalizeText(cp.region)),
        );

        let adjustedDuration = routeData.duration_seconds;

        if (avoidCheckpoints && nearbyCheckpoints.length > 0) {
            const penaltyPerCheckpoint = 300;
            adjustedDuration += nearbyCheckpoints.length * penaltyPerCheckpoint;

            factors.push(
                `${nearbyCheckpoints.length} active checkpoint(s) detected near route`,
            );
            factors.push('Checkpoint avoidance heuristic penalty applied');
        } else if (nearbyCheckpoints.length > 0) {
            factors.push(
                `${nearbyCheckpoints.length} active checkpoint(s) detected near route`,
            );
        }

        if (affectedAvoidAreaCheckpoints.length > 0) {
            const penaltyPerAvoidAreaCheckpoint = 180;
            adjustedDuration +=
                affectedAvoidAreaCheckpoints.length * penaltyPerAvoidAreaCheckpoint;

            factors.push(
                `${affectedAvoidAreaCheckpoints.length} checkpoint(s) found in avoided area(s)`,
            );
        }

        if (avoidAreas.length > 0) {
            factors.push(`Requested avoid areas: ${avoidAreas.join(', ')}`);
        }

        const metadata = {
            weather: weatherData,
            factors,
            checkpoint_analysis: {
                avoid_checkpoints_requested: avoidCheckpoints,
                matched_checkpoints_count: nearbyCheckpoints.length,
                matched_checkpoints: nearbyCheckpoints.map((cp) => ({
                    id: cp.id,
                    name: cp.name,
                    name_ar: cp.name_ar,
                    latitude: this.toNumber(cp.latitude),
                    longitude: this.toNumber(cp.longitude),
                    region: cp.region,
                    type: cp.type,
                })),
                threshold_meters: 2000,
            },
            avoid_area_analysis: {
                requested_areas: avoidAreas,
                matched_checkpoints_in_avoided_areas: affectedAvoidAreaCheckpoints.map(
                    (cp) => ({
                        id: cp.id,
                        name: cp.name,
                        region: cp.region,
                        latitude: this.toNumber(cp.latitude),
                        longitude: this.toNumber(cp.longitude),
                    }),
                ),
            },
            avoid_areas: avoidAreas,
            route_coordinates: routeData.coordinates,
        };

        const expires_at = new Date(Date.now() + 30 * 60 * 1000);

        const routeCache = this.routeCacheRepo.create({
            origin_lat: originLat,
            origin_lng: originLng,
            dest_lat: destLat,
            dest_lng: destLng,
            avoid_checkpoints: avoidCheckpoints,
            avoid_areas_key: avoidAreasKey,
            distance_meters: routeData.distance_meters,
            duration_seconds: adjustedDuration,
            metadata,
            expires_at,
        });

        await this.routeCacheRepo.save(routeCache);

        return {
            distance_meters: routeData.distance_meters,
            duration_seconds: adjustedDuration,
            metadata,
            from_cache: false,
        };
    }

    private toNumber(value: number | string): number {
        return typeof value === 'number' ? value : parseFloat(value);
    }

    private normalizeText(value: string | null | undefined): string {
        return (value ?? '').trim().toLowerCase();
    }

    private buildAvoidAreasKey(avoidAreas: string[]): string {
        return avoidAreas
            .map((area) => this.normalizeText(area))
            .filter((area) => area.length > 0)
            .sort()
            .join(',');
    }

    private distanceInMeters(
        lat1: number,
        lng1: number,
        lat2: number,
        lng2: number,
    ): number {
        const toRad = (deg: number) => (deg * Math.PI) / 180;
        const R = 6371000;

        const dLat = toRad(lat2 - lat1);
        const dLng = toRad(lng2 - lng1);

        const a =
            Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(toRad(lat1)) *
            Math.cos(toRad(lat2)) *
            Math.sin(dLng / 2) *
            Math.sin(dLng / 2);

        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

        return R * c;
    }

    private findNearbyCheckpoints(
        routeCoordinates: [number, number][],
        checkpoints: Checkpoint[],
        thresholdMeters = 500,
    ) {
        const matched: Checkpoint[] = [];

        for (const checkpoint of checkpoints) {
            const checkpointLat = this.toNumber(checkpoint.latitude);
            const checkpointLng = this.toNumber(checkpoint.longitude);

            const isNearRoute = routeCoordinates.some(([lng, lat]) => {
                const distance = this.distanceInMeters(
                    lat,
                    lng,
                    checkpointLat,
                    checkpointLng,
                );
                return distance <= thresholdMeters;
            });

            if (isNearRoute) {
                matched.push(checkpoint);
            }
        }

        return matched;
    }
}