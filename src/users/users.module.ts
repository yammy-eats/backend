import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { UsersService } from './user.service';
import { UsersResolver } from './users.resolver';
import { Verification } from './entities/verification.entity';
import { MailService } from '../mailer/mail.service';

@Module({
  imports: [TypeOrmModule.forFeature([User, Verification])],
  providers: [UsersResolver, UsersService, MailService],
  exports: [UsersService],
})
export class UsersModule {}
