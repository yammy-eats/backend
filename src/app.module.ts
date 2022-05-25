import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import * as Joi from 'joi';
import { UsersModule } from './users/users.module';
import { User } from './users/entities/user.entity';
import { JwtModule } from './jwt/jwt.module';
import { AuthModule } from './auth/auth.module';
import { Verification } from './users/entities/verification.entity';
import { MailerModule } from '@nestjs-modules/mailer';
import { EjsAdapter } from '@nestjs-modules/mailer/dist/adapters/ejs.adapter';
import configEmail from './mailer/mail.config';
import * as path from 'path';
import { Restaurant } from './restaurnats/entities/restaurant.entity';
import { Category } from './restaurnats/entities/category.entity';
import { RestaurantsModule } from './restaurnats/restaurnats.module';
import { Dish } from './restaurnats/entities/dish.entity';
import { OrdersModule } from './orders/orders.module';
import { Order } from './orders/entities/order.entity';
import { OrderItem } from './orders/entities/order-item.entity';
import { CommonModule } from './common/common.module';
import { PaymentsModule } from './payments/payments.module';
import { Payment } from './payments/entities/payment.entity';
import { ScheduleModule } from '@nestjs/schedule';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // 글로벌 모듈은 import 필요 X
      load: [configEmail],
      envFilePath: process.env.NODE_ENV === 'dev' ? '.env.dev' : '.env.test',
      ignoreEnvFile: process.env.NODE_ENV === 'prod',
      validationSchema: Joi.object({
        NODE_ENV: Joi.string().valid('dev', 'prod', 'test').required(),
        DB_HOST: Joi.string().required(),
        DB_PORT: Joi.string().required(),
        DB_USERNAME: Joi.string().required(),
        DB_PASSWORD: Joi.string().required(),
        DB_NAME: Joi.string().required(),
        PRIVATE_KEY: Joi.string().required(),
        EMAIL_AUTH_EMAIL: Joi.string().required(),
        EMAIL_AUTH_PASSWORD: Joi.string().required(),
        EMAIL_HOST: Joi.string().required(),
        EMAIL_FROM_USER_NAME: Joi.string().required(),
      }),
    }),
    GraphQLModule.forRoot({
      installSubscriptionHandlers: true, // pubsub 기능을 사용하기 위해 websocket 기능을 열어줌
      autoSchemaFile: true,
      context: ({ req, connection }) => {
        const TOKEN_KEY = 'x-jwt';
        return {
          token: req ? req.headers[TOKEN_KEY] : connection.context[TOKEN_KEY],
        };
      },
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: +process.env.DB_PORT,
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      synchronize: process.env.NODE_ENV !== 'prod',
      logging:
        process.env.NODE_ENV !== 'prod' && process.env.NODE_ENV !== 'test',
      entities: [
        User,
        Verification,
        Restaurant,
        Category,
        Dish,
        Order,
        OrderItem,
        Payment,
      ],
    }),
    AuthModule,
    UsersModule,
    RestaurantsModule,
    CommonModule,
    PaymentsModule,
    ScheduleModule.forRoot(),
    JwtModule.forRoot({
      privateKey: process.env.PRIVATE_KEY,
    }),
    AuthModule,
    MailerModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        return {
          ...config.get('email'),
          template: {
            dir: path.join(__dirname, './templates/'),
            adapter: new EjsAdapter(),
            options: {
              strict: true,
            },
          },
        };
      },
    }),
    OrdersModule,
    PaymentsModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
