import {BaseResponseDto} from "../../common/dto/base-response.dto";
import {Operation, OperationType} from "../models/operation.model";
import {Exclude, Expose} from "class-transformer";

@Exclude()
export class OperationDto extends BaseResponseDto<OperationDto, Operation> {
  @Expose()
  id: number;

  @Expose()
  operationType: OperationType;

  @Expose()
  details: any;

  @Expose({
    name: 'date'
  })
  createdAt: Date;
}