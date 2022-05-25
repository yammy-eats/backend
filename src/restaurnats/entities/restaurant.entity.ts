import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { Column, Entity, ManyToOne, OneToMany, RelationId } from 'typeorm';
import { IsString, Length } from 'class-validator';
import { CoreEntity } from '../../common/entities/core.entity';
import { Category } from './category.entity';
import { User } from '../../users/entities/user.entity';
import { Dish } from './dish.entity';
import { Order } from '../../orders/entities/order.entity';

@InputType('RestaurantInputType', { isAbstract: true })
@Entity() // TypeORM을 위한 decorator
@ObjectType() // 자동으로 스키마를 빌드하기 위해 사용하는 GraphQL decorator
export class Restaurant extends CoreEntity {
  @Field(() => String) // GraphQL
  @Column() // TypeORM
  @IsString() // DTO의 입력값을 검증
  @Length(2, 100)
  name: string;

  @Field((type) => String)
  @Column()
  @IsString()
  coverImg: string;

  @Field(() => String, { defaultValue: 'ssss' })
  @Column() // TypeORM
  @IsString()
  address: string;

  @Field((type) => Category, { nullable: true })
  @ManyToOne((type) => Category, (category) => category.restaurants, {
    nullable: true,
    onDelete: 'SET NULL',
  })
  category: Category;

  @Field((type) => User)
  @ManyToOne((type) => User, (user) => user.restaurants, {
    onDelete: 'CASCADE',
  })
  owner: User;

  @RelationId((restaurant: Restaurant) => restaurant.owner)
  ownerId: number;

  @Field((type) => [Dish])
  @OneToMany((type) => Dish, (dish) => dish.restaurant)
  menu: Dish[];

  @Field((type) => [Order])
  @OneToMany((type) => Order, (order) => order.restaurant)
  orders: Order[];

  @Field((type) => Boolean)
  @Column({ default: false })
  isPromoted: boolean;

  @Field((type) => Date, { nullable: true })
  @Column({ nullable: true })
  promotedUntil?: Date;
}
