import { OperationDto } from '@src/app/services/operation/types'

export type SuccessResponse = {
	success: boolean
}

export type CommandDto = {
	id: number
	text: string
	operation: OperationDto
	date: string
}

export enum CommandType {
	TRANSFER = 'transfer',
	BALANCE = 'balance',
	PAYMENT = 'payment',
}

export type RecognizedCommandDto = {
	error: boolean
	errorText?: string
	commandType?: CommandType
	params?: RecognizedCommandParams
}

export type RecognizedCommandParams = any
