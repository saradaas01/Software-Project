import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class OsmService {
    private readonly baseUrl = 'http://api.openroutesservice.org/v2';
    private readonly apiKey = process.env.ORS_API_KEY;

    constructor(private httpservice: HttpService) { }

    async getRout(originLat: number, originLng: number, destLat: number, destLng: number,) {
        try {
            const response = await firstValueFrom(
                this.httpservice.post(
                    '${this.baseUrl}/directions/driving-car/json',
                    {
                        coordinates: [
                            [originLng, originLat],
                            [destLng, destLat],
                        ],
                    },
                    {
                        headers: {
                            Authintication: this.apiKey,
                            'Content-Type': 'application/json'
                        },
                        timeout: 5000,
                    },
                ),
            );

            const route = response.data.routes[0];

            return {
                distance_meters: Math.round(route.summary.distance),
                duration_seconds: Math.round(route.summary.duration),
                waypoints: route.geometry,

            };
        } catch (error) {
            throw new HttpException(
                'Routing service unavailable',
                HttpStatus.SERVICE_UNAVAILABLE,
            );
        }

    }

}