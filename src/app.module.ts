import { MiddlewareConsumer, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { QuoteController } from './front/quote.controller';
import { getEnvPath } from './common/helper/env.helper';
import { TypeOrmConfigService } from './shared/typeorm/typeorm.service';
import { ApiModule } from './api/api.module';
import { QuoteModule } from './api/quote/quote.module';
import { LoggerMiddleware } from './front/quote.logger';
import { BaseController } from './app.controller';
import { ContractModule } from './api/contract/contract.module';
import { APP_FILTER } from '@nestjs/core';
import { NotFoundExceptionFilter } from './front/quote.lost';

const envFilePath: string = getEnvPath(`${__dirname}/common/envs`);

@Module({
  imports: [
    ConfigModule.forRoot({ envFilePath, isGlobal: true }),
    TypeOrmModule.forRootAsync({ useClass: TypeOrmConfigService }),
    ApiModule,
    QuoteModule,
    ContractModule
  ],
  controllers: [QuoteController, BaseController],
  providers: [{
    provide: APP_FILTER,
    useClass: NotFoundExceptionFilter,
  }],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}
