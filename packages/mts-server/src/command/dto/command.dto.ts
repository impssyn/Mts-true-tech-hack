import {BaseResponseDto} from "../../common/dto/base-response.dto";
import {Exclude, Expose, Type} from "class-transformer";
import {OperationDto} from "../../operation/dto/operation.dto";

@Exclude()
export class CommandDto extends BaseResponseDto {
  @Expose()
  id: number;

  @Expose()
  text: string;

  @Expose()
  @Type(() => OperationDto)
  operation: OperationDto;

  @Expose({
    name: "date"
  })
  createdAt: Date;
}