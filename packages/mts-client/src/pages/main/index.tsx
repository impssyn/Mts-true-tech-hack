import { Action, HistoryIcon, Transaction, Wallet } from '@assets/svg'
import { toRublesStr } from '@src/app/services/account/helpers'
import { useMyProductsQuery } from '@src/app/services/product/api'
import Logo from '@src/components/logo'
import Micro from '@src/components/micro'
import Page from '@src/components/page'
import { useNavigate } from 'react-router-dom'

import styles from './styles.module.sass'

const Main = () => {
	const navigate = useNavigate()

	const { data } = useMyProductsQuery()

	// loader
	if (!data) return <></>
	return (
		<Page className={styles.wrapper}>
			<div aria-label={"MTS Talk логотип"}>
				<Logo />
			</div>
			<section aria-label={"Действия в приложении"} className={styles.actions}>
				<nav aria-label={"Баланс на моих картах"} className={styles.action} onClick={() => navigate('/balance')}>
					<Wallet width={36} height={36} className={styles.icon} />
					<h2 aria-describedby="balance-hint">Баланс</h2>
					<span id="balance-hint">
						{toRublesStr(data.totalBalance)}
						<br />в сумме
					</span>
				</nav>
				<nav
					aria-label={"Переводы и платежи"}
					className={styles.action}
					onClick={() => navigate('/transactions')}
				>
					<Transaction width={36} height={36} className={styles.icon} />
					<h2 aria-describedby="transfers-hint">Переводы и платежи</h2>
					<span id="transfers-hint">
						{toRublesStr(data.spentInMonth)}
						<br />
						за май
					</span>
				</nav>
			</section>
			<section aria-label={"Быстрые действия"} className={styles.patterns} onClick={() => navigate('/actions')}>
				<div className={styles.patternsTop}>
					<h1 aria-describedby="actions-hint">Быстрое действие</h1>
					<Action className={styles.actionIcon} />
				</div>
				<span id="actions-hint" className={styles.hint}>
					Совершайте повторные операции проще!
				</span>
			</section>
			<section aria-label={"История транзакций"} className={styles.history} onClick={() => navigate('/history')}>
				История <HistoryIcon className={styles.historyIcon} />
			</section>
			<Micro aria-label={"Микрофон голосового помощника"} large className={styles.button} />
		</Page>
	)
}

export default Main
