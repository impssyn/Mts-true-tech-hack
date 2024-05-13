import {ApiProperty} from "@nestjs/swagger";

export class SuccessDto {
  @ApiProperty({
    description: 'Успешное выполнение'
  })
  success: boolean;
}