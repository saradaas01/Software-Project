import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from '../users/user.entity';
import { RefreshToken } from './refresh-token.entity';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
    constructor(
        @InjectRepository(User) private usersRepo: Repository<User>,
        @InjectRepository(RefreshToken) private tokensRepo: Repository<RefreshToken>,
        private jwtService: JwtService,
    ) { }

    async register(dto: RegisterDto) {
        const exists = await this.usersRepo.findOne({ where: { email: dto.email } });
        if (exists) throw new ConflictException('Email already in use');

        const password_hash = await bcrypt.hash(dto.password, 12);
        const user = this.usersRepo.create({
            email: dto.email,
            full_name: dto.full_name,
            phone: dto.phone,
            password_hash,
        });
        await this.usersRepo.save(user);
        return this.generateTokens(user);
    }

    async login(dto: LoginDto) {
        const user = await this.usersRepo.findOne({ where: { email: dto.email } });
        if (!user) throw new UnauthorizedException('Invalid credentials');

        const valid = await bcrypt.compare(dto.password, user.password_hash);
        if (!valid) throw new UnauthorizedException('Invalid credentials');

        if (!user.is_active) throw new UnauthorizedException('Account is disabled');

        return this.generateTokens(user);
    }

    async logout(userId: string) {
        await this.tokensRepo
            .createQueryBuilder()
            .update()
            .set({ is_revoked: true })
            .where('"user_id" = :userId', { userId })
            .execute();
        return { message: 'Logged out successfully' };
    }

    private async generateTokens(user: User) {
        const payload = { sub: user.id, email: user.email, role: user.role };
        const accessToken = this.jwtService.sign(payload, { expiresIn: '24h' });
        const refreshToken = require('crypto').randomBytes(40).toString('hex');

        const token_hash = await bcrypt.hash(refreshToken, 10);
        const expires_at = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

        await this.tokensRepo.save(
            this.tokensRepo.create({ user, token_hash, expires_at })
        );

        return { access_token: accessToken, refresh_token: refreshToken };
    }
}