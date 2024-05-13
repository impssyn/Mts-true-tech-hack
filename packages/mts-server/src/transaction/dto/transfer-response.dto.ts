import {BaseResponseDto} from "../../common/dto/base-response.dto";
import {Transfer} from "../models/transfer.model";
import {Exclude, Expose} from "class-transformer";


@Exclude()
export class TransferResponseDto extends BaseResponseDto<TransferResponseDto, Transfer> {
  @Expose()
  id: number;

  @Expose()
  amount: number;

  @Expose()
  billingAccountId: number;

  @Expose()
  destAccountId: number;

  @Expose()


  @Expose({
    name: 'date'
  })
  createdAt: Date;
}