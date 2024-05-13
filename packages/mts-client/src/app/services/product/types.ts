import { AccountDto } from '@src/app/services/account/types'

export type CreateUserCardArgs = {
	userId: number
	number: string
	cv: string
	expirationYear: string
	expirationMonth: string
	cardType: CardType
	balance: number
}

export type ProductsDto = {
	cards: ProductCardDto[]
	totalBalance: number
	spentInMonth: number
}

export type ProductCardDto = {
	card: CardDto
	account: AccountDto
}

export enum CardType {
	DEBIT = 'debit',
	CREDIT = 'credit',
}

export type CardDto = {
	number: string
	cv: string
	expirationYear: string
	expirationMonth: string
	cardType: CardType
}
