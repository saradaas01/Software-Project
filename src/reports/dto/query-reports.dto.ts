import { IsEnum, IsNumberString, IsOptional, IsString } from 'class-validator';

export class QueryReportsDto {
  @IsOptional()
  @IsNumberString()
  page?: string;

  @IsOptional()
  @IsNumberString()
  limit?: string;

  @IsOptional()
  @IsEnum({
    closure: 'closure',
    delay: 'delay',
    accident: 'accident',
    weather_hazard: 'weather_hazard',
    checkpoint: 'checkpoint',
  })
  category?: string;

  @IsOptional()
  @IsEnum({
    pending: 'pending',
    verified: 'verified',
    rejected: 'rejected',
    duplicate: 'duplicate',
  })
  status?: string;

  @IsOptional()
  @IsString()
  region?: string;
}