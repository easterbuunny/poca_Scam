import { Test, TestingModule } from '@nestjs/testing';
import { QuoteUsecase } from '../api/quote/quote.usecase';
import { QuoteController } from './quote.controller';


describe('QuoteController', () => {
  let app: TestingModule;

  beforeAll(async () => {
    app = await Test.createTestingModule({
      controllers: [QuoteController],
      providers: [
        QuoteUsecase,
        {
          provide: QuoteUsecase,
          useValue: {
            get: jest.fn(),
            findAll: jest.fn(),
            create: jest.fn(),
          },
        },
      ],
    }).compile();
  });

  describe('get Index', () => {
    it('should return a catchphrase', () => {
      const quoteController = app.get<QuoteController>(QuoteController);
      expect(quoteController.index( null )['error_cred']).toEqual(false);
    });
  });
});
