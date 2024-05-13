import {BaseResponseDto} from "../../common/dto/base-response.dto";


export class TransferCheckResponseDto extends BaseResponseDto {
  destAccountId: number;
  recipient: string;
}