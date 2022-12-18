import { Module } from '@nestjs/common';
import { ContractModule } from './contract/contract.module';
import { QuoteModule } from './quote/quote.module';

@Module({
  imports: [QuoteModule, ContractModule],
})
export class ApiModule {}
