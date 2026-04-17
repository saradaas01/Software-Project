import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { RoutesService } from './routes.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { EstimateRouteDto } from './dto/estimate-route.dto';

@Controller('api/v1/routes')
@UseGuards(JwtAuthGuard)
export class RoutesController {
    constructor(private readonly routesService: RoutesService) { }

    @Get('estimate')
    estimateRoute(@Query() query: EstimateRouteDto) {
        return this.routesService.estimateRoute(
            query.origin_lat,
            query.origin_lng,
            query.dest_lat,
            query.dest_lng,
            query.avoid_checkpoints ?? false,
            query.avoid_areas ?? [],
        );
    }
}