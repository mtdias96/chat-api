import { Body, Controller, Post, Res } from '@nestjs/common';
import { Response } from 'express';
import { IsPublic } from 'src/shared/decorator/IsPublic';
import { AuthService } from './auth.service';
import { CreateUserDto, LoginDto } from './dto/login.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @IsPublic()
  @Post('signup')
  @IsPublic()
  create(@Body() createUserDto: CreateUserDto) {
    console.log(Body);
    return this.authService.signup(createUserDto);
  }

  @IsPublic()
  @Post('signin')
  async authenticate(@Body() loginDto: LoginDto, @Res() res: Response) {
    const { accessToken } = await this.authService.signin(loginDto);

    res.cookie('accessToken', accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 1000 * 60 * 60 * 24,
      path: '/',
    });

    res.status(200).json({ message: 'Login realizado com sucesso' });
  }

  @IsPublic()
  @Post('logout')
  logout(@Res() res: Response) {
    res.cookie('accessToken', '', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      expires: new Date(0), // Expira imediatamente
      path: '/',
    });
    return res.status(200).json({ message: 'Logout realizado com sucesso' });
  }
}
