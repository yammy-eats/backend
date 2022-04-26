import { Field, ObjectType } from '@nestjs/graphql';
import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity() // TypeORM을 위한 decorator
@ObjectType() // 자동으로 스키마를 빌드하기 위해 사용하는 GraphQL decorator
export class Restaurant {
  @Field(() => Number)
  @PrimaryGeneratedColumn()
  id: number;

  @Field(() => String) // GraphQL
  @Column() // TypeORM
  name: string;
  @Field(() => Boolean)
  @Column() // TypeORM
  isVegan: boolean;
  @Field(() => String)
  @Column() // TypeORM
  address: string;
  @Field(() => String)
  @Column() // TypeORM
  ownerName: string;
}
