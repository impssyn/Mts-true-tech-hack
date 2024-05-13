import {Exclude, Expose} from "class-transformer";
import {ApiProperty} from "@nestjs/swagger";
import {BaseResponseDto} from "../../common/dto/base-response.dto";


@Exclude()
export class UserRespDto extends BaseResponseDto {
  @ApiProperty({
    description: "ID"
  })
  @Expose()
  id: number;

  @ApiProperty({
    description: "Имя"
  })
  @Expose()
  firstName: string;

  @ApiProperty({
    description: "Фамилия"
  })
  @Expose()
  lastName: string;

  @ApiProperty({
    description: "Отчество"
  })
  @Expose()
  patronymic: string;

  @ApiProperty({
    description: "Имя пользователя"
  })
  @Expose()
  username: string;

  @ApiProperty({
    description: "E-Mail"
  })
  @Expose()
  email: string;

  @ApiProperty({
    description: "Телефон"
  })
  @Expose()
  phone: string;

  @ApiProperty({
    description: "Является администратором"
  })
  @Expose()
  isManager: boolean;
}