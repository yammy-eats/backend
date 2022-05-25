import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Payment } from './entities/payment.entity';
import { PaymentsService } from './payments.service';
import { PaymentsResolver } from './payments.resolver';

@Module({
  imports: [TypeOrmModule.forFeature([Payment])],
  providers: [PaymentsService, PaymentsResolver],
})
export class PaymentsModule {}
