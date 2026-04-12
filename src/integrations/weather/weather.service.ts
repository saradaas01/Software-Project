import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs'

@Injectable()
export class WeatherService {

    private readonly baseUrl = 'http://api.openweathermap.org/data/2.5';
    private readonly apiKey = process.env.WEATHER_API_KEY;

    constructor(private httpService: HttpService) { }

    async getWeather(lat: number, lng: number) {

        try {
            const response = await firstValueFrom(
                this.httpService.get(

                    '${baseUrl}/weather',
                    {
                        params: {
                            lat,
                            long: lng,
                            appid: this.apiKey,
                            units: 'metric'
                        },
                        timeout: 5000,
                    }),
            );
            const data = response.data;
            return {
                condition: data.weather[0].main,
                description: data.weather[0].description,
                temperature: data.main.temp,
                humidity: data.main.humidity,
                wind_speed: data.wind.speed,
                warning: this.getWeatherWarning(data.weather[0].main),
            };

        } catch (errror) {

            throw new HttpException(
                'Weather service unavailable',
                HttpStatus.SERVICE_UNAVAILABLE,
            );

        }
    }

    private getWeatherWarning(condition: string) {
        const warnings = {
            Thunderstorm: 'Severe thunderstorm - avoid travel if possible',
            Rain: 'Rainy conditions - expect delays',
            Snow: 'Snow on roads - drive carefully',
            Fog: 'Low visibility - reduce speed',
            Drizzle: 'Slippery roads - drive carefully',
        };
        return warnings[condition] || null;

    }
}