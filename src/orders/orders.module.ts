import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Order } from './entities/order.entity';
import { OrderResolver } from './orders.resolver';
import { OrderService } from './orders.service';
import { Restaurant } from '../restaurnats/entities/restaurant.entity';
import { OrderItem } from './entities/order-item.entity';
import { Dish } from '../restaurnats/entities/dish.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Order, Restaurant, OrderItem, Dish])],
  providers: [OrderService, OrderResolver],
})
export class OrdersModule {}
