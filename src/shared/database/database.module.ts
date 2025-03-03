import { Global, Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { AuthenticateRepository } from './repositories/auth/authenticate.repositories';
import { UserRepository } from './repositories/user/user.repositories';

@Global()
@Module({
  providers: [PrismaService, AuthenticateRepository, UserRepository],
  exports: [AuthenticateRepository, UserRepository],
})
export class DatabaseModule {}
