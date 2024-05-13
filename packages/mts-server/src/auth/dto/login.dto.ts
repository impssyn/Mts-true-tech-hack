import {IsNotEmpty, IsString} from "class-validator";
import {ApiProperty} from "@nestjs/swagger";

export class LoginDto {
  @ApiProperty({
    description: 'Логин, телефон или E-Mail'
  })
  @IsNotEmpty()
  @IsString()
  lpe: string;

  @ApiProperty({
    description: 'Пароль'
  })
  @IsNotEmpty()
  @IsString()
  pwd: string;
}