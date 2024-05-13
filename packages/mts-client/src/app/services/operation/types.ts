export enum OperationType {
	TRANSFER_IN = 'transfer_in',
	TRANSFER_OUT = 'transfer_out',
	PAYMENT = 'payment',
}

export type OperationDto = {
	id: number
	operationType: OperationType
	details: any
	date: Date
}
