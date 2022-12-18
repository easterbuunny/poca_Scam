import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Contract } from './contract.entity';
import { ContractUsecase } from './contract.usecase';

@Module({
  imports: [TypeOrmModule.forFeature([Contract])],
  controllers: [],
  providers: [ContractUsecase],
  exports: [ContractUsecase],
})
export class ContractModule {}
