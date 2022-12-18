import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateQuoteCommand } from './quote.command';
import { Quote } from './quote.entity';
// eslint-disable-next-line no-var, @typescript-eslint/no-var-requires
var Hashes = require('jshashes');

@Injectable()
export class QuoteUsecase {
  find() {
    throw new Error('Method not implemented.');
  }
  constructor(
    @InjectRepository(Quote) private readonly repository: Repository<Quote>,
  ) {}

  private readonly logger = new Logger(QuoteUsecase.name);

  public async get(id: number): Promise<Quote> {
    return await this.repository.findOneBy({ id });
  }

  public async getByToken(token: string): Promise<Quote> {
    return await this.repository.findOneBy({ token });
  }

  public async findAll(): Promise<Quote[]> {
    return await this.repository.find();
  }

  private getPremium(adress: string): number {
    return Math.floor(100 + adress.length * (Math.random() * 30));
  }

  public async create(body: CreateQuoteCommand): Promise<Quote> {
    const quote: Quote = new Quote();

    // eslint-disable-next-line no-var
    var lastQuote = await this.repository.find({
      take: 1,
      order: { id: 'DESC' },
    });
    let currentId = '0';
    if (lastQuote[0] != undefined) {
      currentId = lastQuote[0].id.toString();
    }

    quote.name = body.name;
    quote.phone = body.phone;
    quote.email = body.email;
    quote.address = body.address;
    quote.premium = this.getPremium(body.address);
    // eslint-disable-next-line no-var
    var tok = new Hashes.SHA512().b64(currentId);
    quote.token = tok
      .replace('/', '')
      .replace('+', '')
      .replace('=', '')
      .substring(0, 25);
    this.logger.log('Created a new Quote for ' + quote.name + '.');

    return await this.repository.save(quote);
  }
}
