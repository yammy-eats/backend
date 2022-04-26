import { Resolver, Query, Args, Mutation } from '@nestjs/graphql';
import { Restaurant } from './entities/restaurant.entity';
import { CreateRestaurantDto } from './dtos/create-restaurant.dto';

@Resolver((of) => Restaurant)
export class RestaurantsResolver {
  @Query(() => [Restaurant])
  restaurant(@Args('vegenOnly') veganOnly: boolean): Restaurant[] {
    return [];
  }
  @Mutation(() => Boolean)
  createRestaurant(
    @Args() createRestaurantDto: CreateRestaurantDto,
  ): boolean {
    return true;
  }
}
