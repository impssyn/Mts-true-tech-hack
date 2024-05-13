import {ApiProperty} from "@nestjs/swagger";

export class AtPayloadDto {
  @ApiProperty({
    description: "ID пользователя"
  })
  id: number;

  @ApiProperty({
    description: "Имя"
  })
  firstName: string;

  @ApiProperty({
    description: "Фамилия"
  })
  lastName: string;

  @ApiProperty({
    description: "Отчество"
  })
  patronymic: string;

  @ApiProperty({
    description: "Телефон"
  })
  phone: string;

  @ApiProperty({
    description: "E-Mail"
  })
  email: string;

  @ApiProperty({
    description: "Является администратором"
  })
  isManager: boolean;
}