import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { createHmac, randomBytes, scryptSync, timingSafeEqual } from 'node:crypto';
import { Repository } from 'typeorm';
import { LoginDto, RegisterDto } from './dto/app_user.dto';
import { User } from './entities/user.entity';

type PublicUser = Pick<User, 'id' | 'name' | 'email'>;

@Injectable()
export class AppUserService {
  constructor(
    @InjectRepository(User)
    private readonly users: Repository<User>,
  ) {}

  async register(dto: RegisterDto) {
    const email = dto.email.trim().toLowerCase();
    const existing = await this.users.findOne({ where: { email } });
    if (existing) throw new ConflictException('Cette adresse email est déjà utilisée');

    const user = this.users.create({
      name: dto.name.trim(),
      email,
      passwordHash: this.hashPassword(dto.password),
    });
    const saved = await this.users.save(user);
    return this.authResponse(saved);
  }

  async login(dto: LoginDto) {
    const email = dto.email.trim().toLowerCase();
    const user = await this.users.findOne({ where: { email } });
    if (!user || !this.verifyPassword(dto.password, user.passwordHash)) {
      throw new UnauthorizedException('Email ou mot de passe incorrect');
    }
    return this.authResponse(user);
  }

  private hashPassword(password: string) {
    const salt = randomBytes(16).toString('hex');
    const hash = scryptSync(password, salt, 64).toString('hex');
    return `${salt}:${hash}`;
  }

  private verifyPassword(password: string, stored: string) {
    const [salt, expected] = stored.split(':');
    if (!salt || !expected) return false;
    const actual = scryptSync(password, salt, 64);
    const expectedBuffer = Buffer.from(expected, 'hex');
    return expectedBuffer.length === actual.length && timingSafeEqual(actual, expectedBuffer);
  }

  private authResponse(user: User) {
    const publicUser: PublicUser = { id: user.id, name: user.name, email: user.email };
    const payload = Buffer.from(JSON.stringify({ sub: user.id, email: user.email })).toString('base64url');
    const secret = process.env.AUTH_SECRET || 'development-only-change-me';
    const signature = createHmac('sha256', secret).update(payload).digest('base64url');
    return { accessToken: `${payload}.${signature}`, user: publicUser };
  }
}
