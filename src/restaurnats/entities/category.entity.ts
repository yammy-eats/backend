import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { IsBoolean, IsOptional, IsString, Length } from 'class-validator';
import { CoreEntity } from '../../common/entities/core.entity';
import { Restaurant } from './restaurant.entity';

@InputType('CategoryInputType', { isAbstract: true })
@Entity() // TypeORM을 위한 decorator
@ObjectType() // 자동으로 스키마를 빌드하기 위해 사용하는 GraphQL decorator
export class Category extends CoreEntity {
  @Field(() => String) // GraphQL
  @Column({ unique: true }) // TypeORM
  @IsString() // DTO의 입력값을 검증
  @Length(5, 10)
  name: string;

  @Field((type) => String, { nullable: true })
  @Column({ nullable: true })
  @IsString()
  coverImg: string;

  @Field((type) => String)
  @Column({ unique: true })
  @IsString()
  slug: string;

  @Field((type) => [Restaurant])
  @OneToMany((type) => Restaurant, (restaurant) => restaurant.category)
  restaurants: Restaurant[];
}
