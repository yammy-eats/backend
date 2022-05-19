import { Module } from '@nestjs/common';
import {
  CategoryResolver,
  DishResolver,
  RestaurantsResolver,
} from './restaurants.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Restaurant } from './entities/restaurant.entity';
import { RestaurantsService } from './restaurants.service';
import { CategoryRepository } from './repositories/category.repository';
import { Dish } from './entities/dish.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Restaurant, Dish, CategoryRepository])], //TypeORM에서 Restaurant repository import
  providers: [
    RestaurantsResolver,
    CategoryResolver,
    DishResolver,
    RestaurantsService,
  ],
})
export class RestaurantsModule {}
