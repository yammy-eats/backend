import { Field, InputType, Int, ObjectType } from '@nestjs/graphql';
import { Column, Entity, ManyToOne, RelationId } from 'typeorm';
import { CoreEntity } from '../../common/entities/core.entity';
import { IsNumber, IsString, Length } from 'class-validator';
import { Restaurant } from './restaurant.entity';

@InputType('DishInputType', { isAbstract: true })
@ObjectType()
class DishOption {
  @Field((type) => String)
  name: string;
  @Field((type) => [String], { nullable: true })
  choices?: string[];
  @Field((type) => Int, { nullable: true })
  extra?: Number;
}

@InputType('DishInputType', { isAbstract: true })
@Entity()
@ObjectType()
export class Dish extends CoreEntity {
  @Field(() => String)
  @Column({ unique: true })
  @IsString()
  @Length(5)
  name: string;

  @Field((typr) => Int)
  @Column()
  @IsNumber()
  price: number;

  @Field(() => String, { nullable: true })
  @Column({ nullable: true })
  @IsString()
  photo: string;

  @Field((type) => String)
  @Column()
  @Length(5, 140)
  description: string;

  @Field((type) => Restaurant)
  @ManyToOne((type) => Restaurant, (restaurant) => restaurant.menu, {
    onDelete: 'CASCADE',
  })
  restaurant: Restaurant;

  @RelationId((dish: Dish) => dish.restaurant)
  restaurantId: number;

  @Field((type) => [DishOption], { nullable: true })
  @Column({ type: 'json', nullable: true })
  options?: DishOption[];
}
