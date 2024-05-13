import {BaseResponseDto} from "../../common/dto/base-response.dto";
import {CommandType} from "../command-type.enum";
import {TransferRecognizedCommandParamsDto} from "./transfer-recognized-command-params.dto";
import {BalanceRecognizedCommandParamsDto} from "./balance-recognized-command-params.dto";
import {PaymentRecognizedCommandParamsDto} from "./payment-recognized-command-params.dto";


export class RecognizedCommandDto extends BaseResponseDto<RecognizedCommandDto> {
  error: boolean;
  text?: string;
  commandType?: CommandType;
  params?: TransferRecognizedCommandParamsDto | BalanceRecognizedCommandParamsDto | PaymentRecognizedCommandParamsDto;
}