import { Resolver } from '@nestjs/graphql';
import { Payment } from './entities/payment.entity';
import { PaymentsService } from './payments.service';

@Resolver((of) => Payment)
export class PaymentsResolver {
  constructor(private readonly paymentService: PaymentsService) {}
}
