import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { RoutesService } from './routes.service'
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';

@Controller('api/v1/routes')
@UseGuards(JwtAuthGuard)

export class RoutesController {

    constructor(private routesService: RoutesService) { }

    @Get('estimate')
    estimateRoute(

        @Query('origin_lat') originLat: string,
        @Query('origin_lng') originLng: string,
        @Query('dest_lat') destLat: string,
        @Query('dest_lng') destLng: string,
        @Query('avoid_checkpoints') avoidCheckpoints: string,

    ) {
        return this.routesService.estimateRoute(
            parseFloat(originLat),
            parseFloat(originLng),
            parseFloat(destLat),
            parseFloat(destLng),
            avoidCheckpoints === 'true',
        );

    }
}
