import { Repository } from 'typeorm';
import { Quote } from './quote.entity';
import { QuoteUsecase } from './quote.usecase';

describe('QuoteUsecase', () => {
  it('should get a quote', async () => {
    const actual = jest.requireActual('typeorm');

    const quoteRepository: Repository<Quote> = {
      ...actual,
      findOneBy: jest.fn().mockResolvedValue({
        id: 1,
        address: '55 rue de Rivoli',
        premium: 100,
        name: 'John Doe',
        email: 'john.doe@mail.com',
        token: 'aitbenali',
        phone: '0123456789',
      }),
      save: jest.fn(),
    };
    const quoteUsecase = new QuoteUsecase(quoteRepository);
    const quote = await quoteUsecase.get(1);
    const num = await quoteUsecase.getByToken('aitbenali');
    expect(num.token).toEqual('aitbenali');
    expect(quote.address).toEqual('55 rue de Rivoli');
    expect(quote.premium).toEqual(100);
    expect(quote.name).toEqual('John Doe');
    expect(quote.email).toEqual('john.doe@mail.com');
    expect(quote.phone).toEqual('0123456789');
    expect(num).toEqual(quote);
  });

  it('get all quotes', async () => {
    const actual = jest.requireActual('typeorm');

    const quoteRepository: Repository<Quote> = {
      ...actual,
      find: jest.fn().mockReturnValue([
        [
          1,
          '55 rue de Rivoli',
          100,
          'John Doe',
          'john.doe@mail.com',
          '0123456789',
        ],
        [
          2,
          '50 rue de Rivoli',
          150,
          'Doe John',
          'doe.john@mail.com',
          '9876543210',
        ],
      ]),
      save: jest.fn(),
    };
    const quoteUsecase = new QuoteUsecase(quoteRepository);
    const quotes = await quoteUsecase.findAll();
    expect(quotes).toHaveLength(2);
    expect(quotes[1]).toEqual([
      2,
      '50 rue de Rivoli',
      150,
      'Doe John',
      'doe.john@mail.com',
      '9876543210',
    ]);
  });
});
