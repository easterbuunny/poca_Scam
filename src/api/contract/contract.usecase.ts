import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Contract } from './contract.entity';

@Injectable()
export class ContractUsecase {
  constructor(
    @InjectRepository(Contract)
    private readonly repository: Repository<Contract>,
  ) {}

  private readonly logger = new Logger(ContractUsecase.name);

  public async get(id: number): Promise<Contract> {
    return await this.repository.findOneBy({ id });
  }

  public async findAll(): Promise<Contract[]> {
    return await this.repository.find();
  }

  // TODO
  public async create(): Promise<Contract> {
    const contract: Contract = new Contract();
    contract.signed = false;
    contract.quote = null;

    this.logger.log('Created a new Contract for ' + contract.quote.name + '.');
    return await this.repository.save(contract);
  }
}
