import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { compare, hash } from 'bcryptjs';
import { AuthenticateRepository } from 'src/shared/database/repositories/auth/authenticate.repositories';
import { CreateUserDto, LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersRepository: AuthenticateRepository,
    private jwtService: JwtService,
  ) {}

  async signup(createUserDto: CreateUserDto) {
    const { email, name, password } = createUserDto;

    if (!name) {
      throw new BadRequestException('Name is required');
    }

    const existingEmail = await this.usersRepository.findUnique({
      where: { email },
    });

    if (existingEmail) {
      throw new BadRequestException('Email already registered');
    }

    const hashedPassword = await hash(password, 12);

    const user = await this.usersRepository.create({
      email,
      name,
      passwordHash: hashedPassword,
    });

    const accessToken = await this.jwtService.signAsync({
      sub: user.id,
    });

    return { accessToken };
  }

  async signin(loginDto: LoginDto) {
    const { email, password } = loginDto;

    const user = await this.usersRepository.findUnique({
      where: { email },
    });

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const passwordMatch = await compare(password, user.passwordHash);

    if (!passwordMatch) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const accessToken = await this.jwtService.signAsync({
      sub: user.id,
    });

    return { accessToken };
  }
}
