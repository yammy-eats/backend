import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Order } from './entities/order.entity';
import { Repository } from 'typeorm';
import { User, UserRole } from '../users/entities/user.entity';
import { CreateOrderInput, CreateOrderOutput } from './dtos/create-order.dto';
import { Restaurant } from '../restaurnats/entities/restaurant.entity';
import { OrderItem } from './entities/order-item.entity';
import { Dish } from '../restaurnats/entities/dish.entity';
import { GetOrdersInput, GetOrdersOutput } from './dtos/get-orders.dto';
import { GetOrderInput, GetOrderOutput } from './dtos/get-order.dto';

@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(Order)
    private readonly orders: Repository<Order>,
    @InjectRepository(OrderItem)
    private readonly orderItems: Repository<OrderItem>,
    @InjectRepository(Restaurant)
    private readonly restaurants: Repository<Restaurant>,
    @InjectRepository(Dish)
    private readonly dishes: Repository<Dish>,
  ) {}

  async createOrder(
    customer: User,
    { restaurantId, items }: CreateOrderInput,
  ): Promise<CreateOrderOutput> {
    try {
      const restaurant = await this.restaurants.findOne(restaurantId);
      if (!restaurant) {
        return {
          ok: false,
          error: '레스토랑을 찾을 수 없습니다.',
        };
      }
      let orderFinalPrice = 0;
      const orderItems: OrderItem[] = [];

      for (const item of items) {
        const dish = await this.dishes.findOne(item.dishId);
        if (!dish) {
          return {
            ok: false,
            error: 'dish not found',
          };
        }
        let dishFinalPrice = dish.price;
        for (const itemOption of item.options) {
          const dishOption = dish.options.find(
            (dishOption) => dishOption.name === itemOption.name,
          );
          if (dishOption) {
            if (dishOption.extra) {
              dishFinalPrice = dishFinalPrice + dishOption.extra;
            } else {
              const dishOptionChoice = dishOption.choices.find(
                (optionChoice) => optionChoice.name === itemOption.choice,
              );
              console.log(dishOptionChoice);
              if (dishOptionChoice) {
                if (dishOptionChoice.extra) {
                  dishFinalPrice = dishFinalPrice + dishOptionChoice.extra;
                }
              }
            }
          }
        }
        orderFinalPrice = orderFinalPrice + dishFinalPrice;
        const orderItem = await this.orderItems.save(
          this.orderItems.create({
            dish,
            options: item.options,
          }),
        );
        orderItems.push(orderItem);
      }
      const order = await this.orders.save(
        this.orders.create({
          customer,
          restaurant,
          total: orderFinalPrice,
          items: orderItems,
        }),
      );
      return {
        ok: true,
      };
    } catch {
      return {
        ok: false,
        error: '주문이 불가능합니다.',
      };
    }
  }

  async getOrders(
    user: User,
    { status }: GetOrdersInput,
  ): Promise<GetOrdersOutput> {
    let orders: Order[];
    if (user.role === UserRole.Client) {
      orders = await this.orders.find({
        where: {
          customer: user,
          ...(status && { status }),
        },
      });
    } else if (user.role === UserRole.Delivery) {
      orders = await this.orders.find({
        where: {
          driver: user,
          ...(status && { status }),
        },
      });
    } else if (user.role === UserRole.Owner) {
      const restaurants = await this.restaurants.find({
        where: {
          owner: user,
        },
        relations: ['orders'],
      });
      orders = restaurants.map((restaurant) => restaurant.orders).flat(1);
      if (status) {
        orders = orders.filter((order) => order.status === status);
      }
    }
    return {
      ok: true,
      orders,
    };
  }

  async getOrder(
    user: User,
    { id: orderId }: GetOrderInput,
  ): Promise<GetOrderOutput> {
    try {
      const order = await this.orders.findOne(orderId, {
        relations: ['restaurant'],
      });
      if (!orderId) {
        return {
          ok: false,
          error: '주문을 찾을 수 없습니다',
        };
      }
      let canSee = true;
      if (user.role === UserRole.Client && order.customerId !== user.id) {
        canSee = false;
      }
      if (user.role === UserRole.Delivery && order.driverId !== user.id) {
        canSee = false;
      }
      if (
        user.role === UserRole.Owner &&
        order.restaurant.ownerId !== user.id
      ) {
        canSee = false;
      }
      if (!canSee) {
        return {
          ok: false,
          error: '주문을 확인할 수 없습니다.',
        };
      }

      return {
        ok: true,
        order,
      };
    } catch {
      return {
        ok: false,
        error: '주문을 확인 할 수 없습니다.',
      };
    }
  }
}
