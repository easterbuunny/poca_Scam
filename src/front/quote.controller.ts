import {
  ArgumentsHost,
  Body,
  BadRequestException,
  Catch,
  Controller,
  ExceptionFilter,
  Get,
  Inject,
  Logger,
  Post,
  Render,
  Req,
  UseFilters,
  Res,
  Param,
} from '@nestjs/common';
import { CreateQuoteCommand } from '../api/quote/quote.command';
import { QuoteUsecase } from '../api/quote/quote.usecase';
import { QuoteService } from './quote.service';
import { ContractSignatureCommand } from '../api/contract/contract.signature';
import { Request, Response } from 'express';

const ERROR_CREDENTIALS = 'error_cred';

enum ERROR_TYPE {
  ERROR_NAME_EMPTY,
  ERROR_PHONE_EMPTY,
  ERROR_PHONE_INVALID,
  ERROR_ADDRESS,
  ERROR_EMAIL,
}

class ErrorProperty {
  expected: string[]; //What the exception should have
  key: string; //The url query key
  message: string; //The front feedback message

  constructor(e: string[], k: string, m: string) {
    this.expected = e;
    this.key = k;
    this.message = m;
  }
}

const SUBSCRIBE_ERRORS = {
  ERROR_CARD_EMPTY: new ErrorProperty(
    ['card', 'empty'],
    'ce',
    'Un numéro de carte est requis.',
  ),
  ERROR_CARD_NUMBER: new ErrorProperty(
    ['card', 'must be a number'],
    'cn',
    'Le numéro de carte doit être un nombre.',
  ),
  ERROR_CARD_LENGTH: new ErrorProperty(
    ['card', 'longer than or equal to'],
    'cn',
    'Le numéro de carte doit avoir une taille de 16 chiffres.',
  ),

  ERROR_EXPIRES_EMPTY: new ErrorProperty(
    ['expires', 'empty'],
    'ee',
    'Une date d\'expiration est requise.',
  ),

  ERROR_HOLDER_EMPTY: new ErrorProperty(
    ['holder', 'empty'],
    'he',
    'Un nom est requis.',
  ),

  ERROR_CVC_EMPTY: new ErrorProperty(
    ['cvc', 'empty'],
    'cve',
    'Un cryptogramme visuel est requis.',
  ),
  ERROR_CVC_NUMBER: new ErrorProperty(
    ['cvc', 'must be a number'],
    'cvn',
    'Le cryptogramme visuel doit être un nombre.',
  ),
  ERROR_CVC_LENGTH: new ErrorProperty(
    ['cvc', 'longer than or equal to'],
    'cvl',
    'Le cryptogramme visuel avoir une taille de 3 chiffres.',
  ),

  ERROR_NAME_EMPTY: new ErrorProperty(
    ['name', 'empty'],
    'ne',
    'Un nom est requis.',
  ),
  ERROR_PHONE_EMPTY: new ErrorProperty(
    ['phone', 'empty'],
    'pe',
    'Un numéro de téléphone est requis.',
  ),
  ERROR_PHONE_INVALID: new ErrorProperty(
    ['phone', 'valid'],
    'pi',
    'Numéro de téléphone non valide.',
  ),
  ERROR_ADDRESS: new ErrorProperty(['address'], 'a', 'Adresse invalide.'),
  ERROR_EMAIL: new ErrorProperty(['email'], 'm', 'Email invalide.'),
  ERROR_INVALID_CARD: new ErrorProperty(
    [],
    'inv',
    'La carte rentrée est invalide.',
  )
};

@Catch(BadRequestException)
class IndexBadRequestExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(IndexBadRequestExceptionFilter.name);
  catch(e: BadRequestException, host: ArgumentsHost) {
    const errors: string[] = e.getResponse()['message'];
    const errors_contain = (str_list: string[]) => {
      for (const e of errors) {
        let contains_str = true;
        for (const str of str_list) {
          if (!e.includes(str)) {
            contains_str = false;
          }
        }

        if (contains_str) {
          return true;
        }
      }

      return false;
    };

    /*
     * Generate the query string for the url
     * If an expected pattern of strings is found in the exception messages list,
     * we append the corresponding key to the query string.
     */
    let query = '';
    Object.values(SUBSCRIBE_ERRORS).forEach((v) => {
      query += errors_contain(v.expected) ? v.key : '';
    });

    this.logger.warn(errors);

    const ctx = host.switchToHttp();
    const r = ctx.getResponse();
    r.redirect('/front?' + ERROR_CREDENTIALS + '=' + query);
  }
}

@Controller('front')
export class QuoteController {
  @Inject(QuoteUsecase)
  private readonly quoteUsecase: QuoteUsecase;

  private readonly quoteService = new QuoteService();

  @Get()
  @Render('index')
  index(@Req() req: Request) {
    /*
     * req can be null in our tests
     * req.query[ ERROR_CREDENTIALS ] can be null if there's no error
     * req.query[ ERROR_CREDENTIALS ] can be undefined if the user explicitly writes 'error_cred=' in the url
     * req.query[ ERROR_CREDENTIALS ] is the string containing all our errors. It can be something other than a string, so we "cast" it
     */
    // eslint-disable-next-line prettier/prettier
    const error_query = req != null && req.query[ERROR_CREDENTIALS] != null && req.query[ERROR_CREDENTIALS] != undefined
      ? new String(req.query[ERROR_CREDENTIALS])
      : '';

    /*
     * Generate the error_messages list.
     * If a SUBSCRIBE_ERRORS error query key is found in our error_query string,
     * we append the corresponding error message to error_messages
     */
    const error_messages: string[] = [];
    Object.values(SUBSCRIBE_ERRORS).forEach((v) => {
      if (error_query.includes(v.key)) {
        error_messages.push(v.message);
      }
    });

    return {
      error_cred: error_query != '',
      error_msg: error_messages,
    };
  }

  @Post('subscribe')
  @UseFilters(IndexBadRequestExceptionFilter)
  async subscribe(@Body() data: CreateQuoteCommand, @Res() res): Promise<void> {
    const quote = await this.quoteUsecase.create(data);
    const pdf_buffer = await this.quoteService.generatePDF(quote, false);
    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': 'attachment; ' + quote.token + '.pdf',
      'Content-Length': (await pdf_buffer).length,
    });
    res.end(pdf_buffer);
  }

  @Get('list')
  @Render('list')
  async list() {
    const quotes = await this.quoteUsecase.findAll();
    return { quotes: quotes };
  }

  @Get('quote/:token')
  async query(@Param() params, @Res() res: Response) {
    const data = await this.quoteUsecase.getByToken(params.token);
    if (data == null) {
      res.send("Ce token n'existe pas.");
    } else {
      const pdf_buffer = await this.quoteService.generatePDF(data, false);
      res.set({
        'Content-Type': 'application/pdf',
        'Content-Disposition': 'attachment; ' + data.token + '.pdf',
        'Content-Length': pdf_buffer.length,
      });
      res.send(pdf_buffer);
      res.end();
    }
  }

  @Get('signature/:token')
  @Render('signature')
  async signature(@Param() params) {
    const quote = await this.quoteUsecase.getByToken(params.token);
    return quote;
  }

  @Post('signature/sign')
  @UseFilters(IndexBadRequestExceptionFilter)
  async sign(@Body() input: ContractSignatureCommand, @Res() res: Response) {

    let arr = (input.cardnumber + "")
      .split("")
      .reverse()
      .map((x) => parseInt(x));
    let lastDigit = arr.splice(0, 1)[0];
    let sum = arr.reduce(
      (acc, val, i) => (i % 2 !== 0 ? acc + val : acc + ((val * 2) % 9) || 9),
      0
    );
    sum += lastDigit;

    if (sum % 10 === 0) {
      const data = await this.quoteUsecase.getByToken(input.token);
      const pdf_buffer = await this.quoteService.generatePDF(data, true);
      res.set({
        'Content-Type': 'application/pdf',
        'Content-Disposition': 'attachment; ' + input.token + '.pdf',
        'Content-Length': (pdf_buffer).length,
      });
      res.end(pdf_buffer);
    } else {
      res.redirect('/front?' + ERROR_CREDENTIALS + '=' + SUBSCRIBE_ERRORS.ERROR_INVALID_CARD.key);
    }
  }
}
