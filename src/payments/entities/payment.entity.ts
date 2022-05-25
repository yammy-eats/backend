import { Field, InputType, Int, ObjectType } from '@nestjs/graphql';
import { Column, Entity, ManyToOne, RelationId } from 'typeorm';
import exp from 'constants';
import { CoreEntity } from '../../common/entities/core.entity';
import { User } from '../../users/entities/user.entity';
import { Restaurant } from '../../restaurnats/entities/restaurant.entity';

@InputType('PaymentInputType', { isAbstract: true })
@ObjectType()
@Entity()
export class Payment extends CoreEntity {
  @Field((type) => Int)
  @Column()
  transactionId: number;

  @Field((type) => User)
  @ManyToOne((type) => User, (user) => user.payments)
  user?: User;

  @RelationId((payment: Payment) => payment.user)
  userId: number;

  @Field((type) => Restaurant)
  @ManyToOne((type) => Restaurant)
  restaurant: Restaurant;

  @Field((type) => Int)
  @RelationId((payment: Payment) => payment.restaurant)
  restaurantId: number;
}
