import { IsEmail, IsNotEmpty, IsPhoneNumber, IsString } from 'class-validator';

export class CreateQuoteCommand {
  @IsString()
  @IsNotEmpty()
  public name: string;

  @IsPhoneNumber('FR')
  @IsNotEmpty()
  public phone: string;

  @IsString()
  @IsNotEmpty()
  public address: string;

  @IsEmail()
  public email: string;
}
