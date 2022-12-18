import { Length, IsEmail, IsNotEmpty, IsNumberString, IsPhoneNumber, IsString } from 'class-validator';

export class ContractSignatureCommand {
  @IsString()
  @IsNotEmpty()
  public token: string;

  @IsNumberString()
  @Length( 16 )
  public cardnumber: number;

//I don't know how to do this one properly, sorry
  @IsString()
  @IsNotEmpty()
  public expires: string;

  @IsString()
  @IsNotEmpty()
  public holder: string;

  @IsNumberString()
  @Length( 3 )
  public cvc: number;
}