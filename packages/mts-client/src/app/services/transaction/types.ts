export type CheckTransferArgs = {
	amount: number
	accountId: number
	cardNumber?: string
	phoneNumber?: string
}

export type CheckTransferDto = {
	destAccountId: number
	recipient: string
}

export type TransferArgs = {
	amount: number
	billingAccountId: number
	destAccountId: number
}

export type PayArgs = {
	accountId: number
	amount: number
	paymentType: PaymentType
	data: any
}
