import { IsString, IsNumber, IsOptional } from 'class-validator';

export class CreateSubscriptionDto {
  @IsOptional()
  @IsString()
  area_name?: string;

  @IsOptional()
  @IsNumber()
  latitude?: number;

  @IsOptional()
  @IsNumber()
  longitude?: number;

  @IsOptional()
  @IsNumber()
  radius_km?: number;

  @IsOptional()
  @IsString()
  category?: string;
}