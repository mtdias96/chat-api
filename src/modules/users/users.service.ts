import { Injectable, NotFoundException } from '@nestjs/common';
import { UserRepository } from 'src/shared/database/repositories/user/user.repositories';

@Injectable()
export class UsersService {
  constructor(private readonly userRepository: UserRepository) {}
  async findOne(id: string) {
    const userAccessExists = await this.userRepository.findUnique({
      where: { id },
    });

    if (!userAccessExists) {
      throw new NotFoundException('User not found');
    }

    return userAccessExists;
  }
}
