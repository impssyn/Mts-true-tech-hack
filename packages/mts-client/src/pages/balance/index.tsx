import { toRublesStr } from '@src/app/services/account/helpers'
import { useMyProductsQuery } from '@src/app/services/product/api'
import { Copy } from '@src/assets/svg'
import Logo from '@src/components/logo'
import Micro from '@src/components/micro'
import Page from '@src/components/page'
import cl from 'classnames'

import styles from './styles.module.sass'
import cardSrc from '@assets/png/card.png'

const Balance = () => {
	const { data } = useMyProductsQuery()
	const totalBalance = data?.totalBalance || 1
	const cards =
		data?.cards.map((card) => {
			return {
				id: card.account.id,
				balance: card.account.balance,
				number: card.card.number,
				type: card.card.cardType,
			}
		}) || []
	const creditBalance = cards.reduce(
		(acc, current) => (current.type === 'credit' ? acc + current.balance : acc),
		0,
	)
	const debitBalance = cards.reduce(
		(acc, current) => (current.type === 'debit' ? acc + current.balance : acc),
		0,
	)

	return (
		<Page className={styles.container}>
			<div aria-label={"MTS Talk логотип"}>
				<Logo />
			</div>
			<div aria-label={"Общий баланс"}>
				<h2 aria-describedby="balance-hint" className={styles.balance}>
					{toRublesStr(totalBalance)}
				</h2>
				<span id="balance-hint" className={styles.hint}>
					на всех счетах
				</span>
			</div>
			<div aria-label={"Визуализатор баланса"} className={styles.progress}>
				<div
					className={styles.green}
					style={{
						width: `calc(${(debitBalance / totalBalance) * 100}%)`,
					}}
				/>
				<div
					className={styles.yellow}
					style={{
						width: `calc(${(creditBalance / totalBalance) * 100}%)`,
					}}
				/>
			</div>
			<article aria-label={"Мои продукты"} className={styles.list}>
				<section aria-describedby="header-1" className={styles.group}>
					<h3
						aria-describedby="header-1"
						className={cl(styles.subheader, styles.green)}
					>
						Дебетовые карты
					</h3>
					{cards
						.filter((card) => card.type === 'debit')
						.map((card) => {
							return (
								<div key={card.id} className={styles.content}>
									<img className={cl(styles.image)} src={cardSrc} />
									<div className={styles.text}>
										<h4 className={styles.name}>{card.number}</h4>
										<span className={styles.sum}>
											{toRublesStr(card.balance)}
										</span>
									</div>
									<Copy className={styles.icon} width={30} height={30} />
								</div>
							)
						})}
				</section>
				<section aria-describedby="header-2" className={styles.group}>
					<h3 id="header-2" className={cl(styles.subheader, styles.yellow)}>
						Кредитные карты
					</h3>
					{cards
						.filter((card) => card.type === 'credit')
						.map((card) => {
							return (
								<div className={styles.content}>
									<img className={cl(styles.image)} src={cardSrc} />
									<div className={styles.text}>
										<h4 className={styles.name}>{card.number}</h4>
										<span className={styles.sum}>
											{toRublesStr(card.balance)}
										</span>
									</div>
									<Copy className={styles.icon} width={30} height={30} />
								</div>
							)
						})}
				</section>
			</article>
			<Micro aria-label={"Микрофон голосового помощника"} className={styles.micro} />
		</Page>
	)
}

export default Balance
