import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { Injectable } from '@nestjs/common';
import { CreateAccountInput } from './dtos/create-account.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private readonly users: Repository<User>,
  ) {}

  async createAccount({
    email,
    password,
    role,
  }: CreateAccountInput): Promise<{ ok: boolean; error?: string }> {
    // check new user
    // create user & hash the password
    try {
      const exists = await this.users.findOneBy({ email });
      if (exists) {
        return { ok: false, error: '계정이 존재합니다.' };
      }
      await this.users.save(this.users.create({ email, password, role }));
      return { ok: true };
    } catch (e) {
      return { ok: false, error: '계정을 생성할 수 없습니다.' };
    }
  }
}
