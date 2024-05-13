export type CreateUserArgs = {
	firstName: string
	lastName: string
	patronymic: string
	username: string
	email: string
	phone: string
	pwd: string
	isManager: boolean
}

export type UpdateUserArgs = {
	userId: number
} & CreateUserArgs

export type UserDto = {
	firstName: string
	lastName: string
	patronymic: string
	username: string
	email: string
	phone: string
	pwd: string
	isManager: boolean
}
