import { Field, ObjectType } from '@nestjs/graphql';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { IsBoolean, IsString, Length } from 'class-validator';

@Entity() // TypeORM을 위한 decorator
@ObjectType() // 자동으로 스키마를 빌드하기 위해 사용하는 GraphQL decorator
export class Restaurant {
  @Field(() => Number)
  @PrimaryGeneratedColumn()
  id: number;

  @Field(() => String) // GraphQL
  @Column() // TypeORM
  @IsString() // DTO의 입력값을 검증
  @Length(5, 10)
  name: string;
  @Field(() => Boolean)
  @Column() // TypeORM
  @IsBoolean()
  isVegan: boolean;
  @Field(() => String)
  @Column() // TypeORM
  @IsString()
  address: string;
  @Field(() => String)
  @Column() // TypeORM
  @IsString()
  ownersName: string;
}
