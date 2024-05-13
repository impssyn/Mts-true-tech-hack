import {IsBoolean, IsEmail, IsNotEmpty, IsPhoneNumber, IsString} from "class-validator";
import {ApiProperty} from "@nestjs/swagger";

export class CreateUserDto {
  @ApiProperty({
    description: "Имя"
  })
  @IsNotEmpty()
  @IsString()
  firstName: string;

  @ApiProperty({
    description: "Фамилия"
  })
  @IsNotEmpty()
  @IsString()
  lastName: string;

  @ApiProperty({
    description: "Отчество"
  })
  @IsNotEmpty()
  @IsString()
  patronymic: string;

  @ApiProperty({
    description: "Имя пользователя"
  })
  @IsNotEmpty()
  @IsString()
  username: string;

  @ApiProperty({
    description: "E-Mail"
  })
  @IsNotEmpty()
  @IsString()
  @IsEmail()
  email: string;

  @ApiProperty({
    description: "Номер телефона"
  })
  @IsNotEmpty()
  @IsString()
  @IsPhoneNumber('RU')
  phone: string;

  @ApiProperty({
    description: "Пароль"
  })
  @IsNotEmpty()
  @IsString()
  pwd: string;

  @ApiProperty({
    description: "Является администратором"
  })
  @IsNotEmpty()
  @IsBoolean()
  isManager: boolean;
}