import { Transform } from 'class-transformer';
import {
    IsArray,
    IsBoolean,
    IsLatitude,
    IsLongitude,
    IsOptional,
    IsString,
} from 'class-validator';

export class EstimateRouteDto {
    @Transform(({ value }) => parseFloat(value))
    @IsLatitude()
    origin_lat!: number;

    @Transform(({ value }) => parseFloat(value))
    @IsLongitude()
    origin_lng!: number;

    @Transform(({ value }) => parseFloat(value))
    @IsLatitude()
    dest_lat!: number;

    @Transform(({ value }) => parseFloat(value))
    @IsLongitude()
    dest_lng!: number;

    @IsOptional()
    @Transform(({ value }) => value === 'true')
    @IsBoolean()
    avoid_checkpoints?: boolean = false;

    @IsOptional()
    @Transform(({ value }) => {
        if (value === undefined) return [];
        if (Array.isArray(value)) return value;
        return [value];
    })
    @IsArray()
    @IsString({ each: true })
    avoid_areas?: string[] = [];
}