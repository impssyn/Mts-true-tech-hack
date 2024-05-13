import { toRublesStr } from '@src/app/services/account/helpers'
import { useMyProductsQuery } from '@src/app/services/product/api'
import {
	useCheckTransferMutation,
	usePayMutation,
} from '@src/app/services/transaction/api'
import { SendFree } from '@src/assets/svg'
import Input from '@src/components/Input'
import HorizontalScroll from '@src/components/horizontalScroll'
import { FormEvent, useState } from 'react'
import { toast } from 'react-toastify'

import styles from './payments.module.sass'
import card from '@assets/png/card.png'

const Payments = () => {
	const [amount, setAmount] = useState(0)
	const [number, setNumber] = useState('')
	const [isCard, setCard] = useState(false)
	const { data } = useMyProductsQuery()
	const accountId = data?.cards[0].account.id || 1
	const [checkTransfer] = useCheckTransferMutation()
	const [pay] = usePayMutation()
	const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault()
		checkTransfer({
			amount: amount,
			accountId: accountId,
			cardNumber: isCard ? number : undefined,
			phoneNumber: !isCard ? number : undefined,
		})
			.then((data: any) => {
				// при успешной проверке трансфера осуществляем его
				pay({
					amount: amount,
					accountId: accountId,
					paymentType: 'mobile', // todo смена типа оплаты
					data: {
						operator: 'FakeMts',
					}, //todo дополнительные данные перевода
				}).then((data: any) => {
					if (data.success === true) {
						setAmount(0)
						return toast.success('Успешный трансфер')
					}
					return toast.error('Ошибка при переводе')
				})
			})
			.catch((e) => toast.error(e))
	}
	return (
		<>
			<form
				aria-describedby="payments"
				className={styles.container}
				onSubmit={handleSubmit}
			>
				<section className={styles.group}>
					<select
						className={styles.select}
						onChange={(e) => setCard(e.target.value === 'card')}
					>
						<option>По телефону:</option>
						<option>По номеру карты:</option>
					</select>
					<Input
						onChange={(e) => setNumber(e.target.value)}
						placeholder="Введите номер..."
					></Input>
				</section>
				<section className={styles.group}>
					<select className={styles.select}>
						<option>С карты:</option>
					</select>
					<div className={styles.account}>
						<img className={styles.card} src={card} />
						<div className={styles.text}>
							<h4 className={styles.name}>
								{data?.cards[0].card.number || '1234 1234 1234 1234'}
							</h4>
							<span className={styles.sum}>
								{toRublesStr(data?.cards[0].account.balance || 0)}
							</span>
						</div>
					</div>
					<Input placeholder="Введите сумму..."></Input>
				</section>
				<div className={styles.errorSpace}>здесь текст про какуб то ошибку</div>
				<HorizontalScroll
					className={styles.navigation}
					handleClick={() => console.log('click')}
					tabs={['Мобильная связь', 'ЖКХ', 'Интернет']}
				/>
				<button className={styles.sendButton}>
					Отправить
					<SendFree width={36} height={36} className={styles.sendIcon} />
				</button>
			</form>
		</>
	)
}

export default Payments
