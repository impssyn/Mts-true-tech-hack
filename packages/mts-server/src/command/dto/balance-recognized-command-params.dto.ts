import {CommandType} from "../command-type.enum";
import {Exclude, Expose} from "class-transformer";
import {CommandBalanceTargetType} from "../interfaces/balance-command-params.interface";

@Exclude()
export class BalanceRecognizedCommandParamsDto {
  targetType?: CommandBalanceTargetType;
  balance?: number;
  accountId?: number;
  error: boolean;
  errorText?: string;
}