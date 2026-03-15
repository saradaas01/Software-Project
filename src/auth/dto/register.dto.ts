import { IsEmail, IsString, MinLength, IsOptional } from 'class-validator';

export class RegisterDto {
    @IsEmail()
    email: string;

    @IsString()
    full_name: string;

    @IsString()
    @MinLength(8)
    password: string;

    @IsOptional()
    @IsString()
    phone?: string;
}