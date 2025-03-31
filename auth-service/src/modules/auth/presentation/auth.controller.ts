import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from '../app/auth.service';
import { LoginDto } from '../app/dtos/login.dto';
import { RegisterDto } from '../app/dtos/register.dto';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('auth')
@Controller({ version: '2', path: 'auth' })
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @ApiOperation({ summary: 'Přihlášení uživatele' })
  @ApiResponse({
    status: 200,
    description: 'Přihlášení proběhlo úspěšně',
    schema: { example: { accessToken: 'jwt-token' } },
  })
  @ApiResponse({ status: 401, description: 'Neplatné přihlašovací údaje' })
  async login(@Body() loginDto: LoginDto): Promise<{ accessToken: string }> {
    console.log('📥 Login request:', loginDto);
    return this.authService.login(loginDto);
  }

  @Post('register')
  @ApiOperation({ summary: 'Registrace nového uživatele' })
  @ApiResponse({
    status: 200,
    description: 'Registrace proběhla úspěšně',
    schema: { example: { accessToken: 'jwt-token' } },
  })
  @ApiResponse({
    status: 409,
    description: 'Uživatel s tímto emailem již existuje',
  })
  async register(
    @Body() registerDto: RegisterDto,
  ): Promise<{ accessToken: string }> {
    return this.authService.register(registerDto);
  }
}
