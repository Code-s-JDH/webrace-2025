import { Injectable, UnauthorizedException, ConflictException, Inject, OnModuleInit } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { User } from '../domain/user.entity';
import { IAuthRepository } from '../domain/auth.repository';
import { LoginDto } from './dtos/login.dto';
import { RegisterDto } from './dtos/register.dto';

@Injectable()
export class AuthService implements OnModuleInit {
  constructor(
    @Inject('IAuthRepository')
    private readonly authRepository: IAuthRepository,
    private readonly jwtService: JwtService,
  ) {}

  async onModuleInit() {
    const testEmail = 'test@test.test';
    const testPassword = 'test';

    const existingUser = await this.authRepository.findByEmail(testEmail);
    if (!existingUser) {
      const hashedPassword = await bcrypt.hash(testPassword, 10);
      await this.authRepository.createUser({ email: testEmail, password: hashedPassword });
      console.log(`✅ Testovací uživatel vytvořen: ${testEmail}`);
    }
  }

  async login(loginDto: LoginDto): Promise<{ accessToken: string }> {
    const user = await this.validateUser(loginDto.email, loginDto.password);
    const payload = { email: user.email, sub: user.id };
    return {
      accessToken: this.jwtService.sign(payload),
    };
  }

  async register(registerDto: RegisterDto): Promise<{ accessToken: string }> {
    const { email, password } = registerDto;
    const existingUser = await this.authRepository.findByEmail(email);
    if (existingUser) {
      throw new ConflictException('Uživatel s tímto emailem již existuje');
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await this.authRepository.createUser({ email, password: hashedPassword });
    const payload = { email: newUser.email, sub: newUser.id };
    return {
      accessToken: this.jwtService.sign(payload),
    };
  }

  async validateUser(email: string, password: string): Promise<User> {
    const user = await this.authRepository.findByEmail(email);
    if (user && (await bcrypt.compare(password, user.password))) {
      return user;
    }
    throw new UnauthorizedException('Neplatné přihlašovací údaje');
  }

}
