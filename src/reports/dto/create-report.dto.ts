import { IsString, IsNumber, IsOptional, IsEnum } from 'class-validator';

export class CreateReportDto {
  @IsString()
  user_id!: string;

  @IsOptional()
  @IsString()
  duplicate_of?: string;

  @IsNumber()
  latitude!: number;

  @IsNumber()
  longitude!: number;

  @IsEnum({
    closure: 'closure',
    delay: 'delay',
    accident: 'accident',
    weather_hazard: 'weather_hazard',
    checkpoint: 'checkpoint',
  })
  category!: string;

  @IsString()
  description!: string;

  @IsOptional()
  @IsString()
  region?: string;
}