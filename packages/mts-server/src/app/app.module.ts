import {Module} from '@nestjs/common';
import * as process from 'process';
import {ConfigModule, ConfigService} from "@nestjs/config";
import {SequelizeModule, SequelizeModuleAsyncOptions} from "@nestjs/sequelize";
import {CacheModuleAsyncOptions} from "@nestjs/cache-manager";
import * as redisStore from 'cache-manager-redis-store';
import {AppController} from "./app.controller";
import baseConfig from "../config/base.config";
import databaseConfig from "../config/database.config";
import redisConfig from "../config/redis.config";
import {CacheModule} from "@nestjs/common/cache";
import {AuthModule} from "../auth/auth.module";
import {UserModule} from "../user/user.module";
import {ProductModule} from "../product/product.module";
import {TransactionModule} from "../transaction/transaction.module";
import {OperationModule} from "../operation/operation.module";
import {AccountModule} from "../account/account.module";
import {User} from "../user/models/user.model";
import {Account} from "../account/models/account.model";
import {Card} from "../product/models/card.model";
import {Payment} from "../transaction/models/payment.model";
import {Transfer} from "../transaction/models/transfer.model";
import {Operation} from "../operation/models/operation.model";
import {Command} from "../command/models/command.model";
import {CommandModule} from "../command/command.module";
import {AppService} from "./app.service";


const isDevMode = process.env.NODE_ENV === 'development'

const sequelizeOptions: SequelizeModuleAsyncOptions = {
  imports: [ConfigModule],
  useFactory: (configService: ConfigService) => {
    return {
      dialect: 'postgres',
      host: configService.getOrThrow('database.host'),
      port: +configService.getOrThrow('database.port'),
      username: configService.getOrThrow('database.user'),
      password: configService.getOrThrow('database.password'),
      database: configService.getOrThrow('database.db_name'),
      models: [User, Account, Card, Payment, Transfer, Operation, Command],
      synchronize: isDevMode,
      logging: false,
      sync: isDevMode && {
        alter: true,
        force: true
      },
      autoLoadModels: isDevMode
    }
  },
  inject: [ConfigService],
}


const cacheOptions: CacheModuleAsyncOptions = {
  useFactory: async (configService: ConfigService) => ({
    store: redisStore,
    host: configService.getOrThrow('redis-client.host'),
    port: configService.getOrThrow('redis-client.port'),
    username: configService.getOrThrow('redis-client.username'),
    password: configService.getOrThrow('redis-client.password'),
  }),
  imports: [ConfigModule],
  inject: [ConfigService],
  isGlobal: true
}

const appModules = [
  AuthModule,
  AccountModule,
  UserModule,
  ProductModule,
  TransactionModule,
  OperationModule,
  CommandModule
]

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: `.${process.env.NODE_ENV}.env`,
      load: [baseConfig, databaseConfig, redisConfig],
      cache: true
    }),
    SequelizeModule.forRootAsync(sequelizeOptions),
    CacheModule.registerAsync(cacheOptions),
    ...appModules
  ],
  providers: [
    AppService
  ],
  controllers: [AppController]
})
export class AppModule {}
