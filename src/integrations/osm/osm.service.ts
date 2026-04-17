import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class OsmService {
    private readonly baseUrl = 'https://api.openrouteservice.org/v2';
    private readonly apiKey = process.env.ORS_API_KEY;

    constructor(private httpservice: HttpService) { }

    async getRoute(
        originLat: number,
        originLng: number,
        destLat: number,
        destLng: number,
    ) {
        try {
            const response = await firstValueFrom(
                this.httpservice.post(
                    `${this.baseUrl}/directions/driving-car/geojson`,
                    {
                        coordinates: [
                            [originLng, originLat],
                            [destLng, destLat],
                        ],
                    },
                    {
                        headers: {
                            Authorization: this.apiKey,
                            'Content-Type': 'application/json',
                        },
                        timeout: 5000,
                    },
                ),
            );

            const feature = response.data?.features?.[0];

            if (!feature) {
                throw new HttpException('No route found', HttpStatus.NOT_FOUND);
            }

            const summary = feature.properties?.summary;
            const coordinates = feature.geometry?.coordinates ?? [];

            return {
                distance_meters: Math.round(summary.distance),
                duration_seconds: Math.round(summary.duration),
                coordinates, // [[lng, lat], [lng, lat], ...]
            };
        } catch (error) {
            if (error instanceof HttpException) throw error;

            throw new HttpException(
                'Routing service unavailable',
                HttpStatus.SERVICE_UNAVAILABLE,
            );
        }
    }
}