import {CommandType} from "../command-type.enum";
import {ITransferCommandParams} from "./transfer-command-params.interface";
import {IBalanceCommandParams} from "./balance-command-params.interface";
export enum AiRecognizedCommandStatus {
  OK = 'ok',
  ERROR = 'error'
}

export interface IAiRecognizedCommand {
  status: AiRecognizedCommandStatus;
  type: CommandType;
  params: ITransferCommandParams | IBalanceCommandParams;
  errorType: string; // todo: types
}