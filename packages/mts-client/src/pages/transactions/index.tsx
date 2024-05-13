import Micro from '@src/components/micro'
import Page from '@src/components/page'
import cl from 'classnames'
import { useState } from 'react'

import Payments from './Payments'
import Transfers from './Transfers'
import styles from './styles.module.sass'

type PageType = 'transfers' | 'payments'

const Transactions = () => {
	const [activeTab, setActiveTab] = useState('transfers')
	const tabClassname = (type: PageType) => {
		return activeTab === type ? cl(styles.tab, styles.activeTab) : styles.tab
	}
	const handleTab = (type: PageType) => {
		if (type === activeTab) return
		setActiveTab(type)
	}
	return (
		<Page className={styles.container}>
			<nav className={styles.tabs}>
				<div
					id="transfers"
					className={tabClassname('transfers')}
					onClick={() => handleTab('transfers')}
				>
					Переводы
				</div>
				<div
					id="payments"
					className={tabClassname('payments')}
					onClick={() => handleTab('payments')}
				>
					Платежи
				</div>
			</nav>
			{activeTab === 'transfers' ? <Transfers /> : <Payments />}
			<Micro />
		</Page>
	)
}

export default Transactions
