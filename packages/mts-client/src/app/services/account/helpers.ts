export function toRublesStr(amount: number) {
	return `${Math.floor(amount / 100)},${amount % 100} ₽`
}
