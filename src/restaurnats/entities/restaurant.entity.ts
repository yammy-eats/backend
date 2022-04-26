import { Field, ObjectType } from '@nestjs/graphql';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { IsBoolean, IsOptional, IsString, Length } from 'class-validator';

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

  @Field(() => Boolean, { nullable: true, defaultValue: true })
  @Column({ default: true }) // TypeORM
  @IsOptional()
  @IsBoolean()
  isVegan: boolean;

  @Field(() => String, {defaultValue: 'ssss'})
  @Column() // TypeORM
  @IsString()
  address: string;

  @Field(() => String)
  @Column() // TypeORM
  @IsString()
  ownersName: string;
}
