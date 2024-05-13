import { useMyCommandsQuery } from '@src/app/services/command/api'
import { Add, Chevron } from '@src/assets/svg'
import HorizontalScroll from '@src/components/horizontalScroll'
import Micro from '@src/components/micro'
import Page from '@src/components/page'
import { useState } from 'react'

import styles from './styles.module.sass'

const TEMP_DATA = {
	recs: [
		{ text: 'Оплата ЖКХ', times: 4 },
		{ text: 'Платёж по кредиту', times: 2 },
	],
	popular: [{ text: 'Перевод маме' }, { text: 'Пополнить вклад' }],
}

const Actions = () => {
	const tabs = ['Мои', 'Рекомендации', 'Популярные']
	const [activeTab, setActiveTab] = useState('Мои')
	const { data } = useMyCommandsQuery()
	const cards =
		{
			['Мои']: data,
			['Рекомендации']: TEMP_DATA.recs,
			['Популярные']: TEMP_DATA.popular,
		}[activeTab] || []
	const openTransaction = () => {
		// todo
	}
	const addCommand = () => {
		//
	}
	return (
		<Page>
			<section className={styles.list}>
				{cards.map((card) => {
					return (
						<div key={card.text} className={styles.card}>
							{activeTab === 'Популярные' && (
								<h1 className={styles.h1}>
									Есть у {Math.floor(Math.random() * 50) + 50}% пользователей
								</h1> //todo Статистика по наличию команды
							)}
							<h2 className={styles.h2}>
								{activeTab === 'Рекомендации'
									? `${card.times} раза за последний месяц`
									: `Команда: "${card.text}"`}
							</h2>
							<div className={styles.content}>
								<div
									className={styles.avatar}
									style={{ background: '#FF0032' }}
								/>
								<h4 className={styles.name}>Анонимный аккаунт</h4>
								<div className={styles.description}>
									<h6 className={styles.sum}> - 1000 ₽</h6>
									<span className={styles.from}>карта</span>
								</div>
								{activeTab === 'Мои' ? (
									<Chevron width={28} height={28} className={styles.icon} />
								) : (
									<Add width={28} height={28} className={styles.icon} />
								)}
							</div>
						</div>
					)
				})}
				{activeTab === 'Мои' && <button className={styles.addCommand} />}
				<HorizontalScroll
					className={styles.nav}
					handleClick={(tab: string) => {
						setActiveTab(tab)
					}}
					tabs={tabs}
				/>
			</section>
			<Micro />
		</Page>
	)
}

export default Actions
