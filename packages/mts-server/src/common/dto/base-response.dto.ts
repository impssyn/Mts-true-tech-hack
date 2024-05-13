import {ApiProperty} from "@nestjs/swagger";

export class BaseResponseDto<T extends any = any, M extends any = T>{
  @ApiProperty({
    description: 'Успешное выполнение'
  })
  success?: boolean;
  constructor(partial: Partial<GetObjSameKeys<T, M> | T>) {
    Object.assign(this, partial);
  }
}
