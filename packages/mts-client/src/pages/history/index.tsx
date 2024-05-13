import { Phone } from '@assets/svg'
import { toRublesStr } from '@src/app/services/account/helpers'
import { useOperationsHistoryQuery } from '@src/app/services/operation/api'
import {OperationDto, OperationType} from '@src/app/services/operation/types'
import { SaveCommand } from '@src/assets/svg'
import Micro from '@src/components/micro'
import Page from '@src/components/page'
import PageHeader from '@src/components/pageHeader'
import { groupBy } from 'lodash'

import styles from './styles.module.sass'
import {useNavigate} from "react-router-dom";
const synth = window.speechSynthesis;

const History = () => {
	const { data: history } = useOperationsHistoryQuery()
	const navigate = useNavigate()

	const speak = (textValue: string) => {
		const synth = window.speechSynthesis;
		const utterance = new SpeechSynthesisUtterance(textValue);
		// utterance.voice = synth.getVoices()[4];
		utterance.voice = synth.getVoices()[4]
		window.speechSynthesis.speak(utterance);
	}

	const handleSaveOperation = (operation: OperationDto) => {
		speak('Чтобы сохранить операцию в быстрые действия, вам необходимо задать ей команду, для этого напишите ее или скажите, зажав кнопку разговора')
		navigate(`/saveCommand?operationId=${operation.id}`)
	}

	if (!history) return <></>

	// фильтрация по месяцу
	const filteredByMonthHistory = history.filter(
		(hItem) => new Date(hItem.date).getMonth() === 4,
	)

	const groupedByDateHistory = groupBy(filteredByMonthHistory, (hItem) => {
		return new Date(hItem.date).getDate().toString()
	})

	return (
		<Page aria-describedby="header" className={styles.container}>
			<PageHeader aria-label="История транзакций" id="header">История</PageHeader>
			<section aria-label="Выберите период" className={styles.chosen}>
				<h2 className={styles.periodHint}>
					выбранный период:
					<select className={styles.periodSelect}>
						<option>май</option>
					</select>
				</h2>
			</section>
			<div aria-label="Список операций за май">
				{Object.entries(groupedByDateHistory).sort((a,b) => b[0] - a[0]).map(([date, history], index) => (
					<section
						aria-describedby="date"
						aria-label={`Операции за ${date} мая`}
						className={styles.dayCard}
						key={`${date}-${index}`}
					>
						<h2 id="date" className={styles.date}>
							{date} мая
						</h2>
						{history.map((operation: any) => (
							<div
								className={styles.transaction}
								key={operation.id}
							>
								{operation.operationType === OperationType.TRANSFER_IN && (
									<div
										aria-label={`Пополнение баланса от ${operation.details.sender}`}
									>
										<div
											className={styles.avatar}
											style={{ background: '#FF0032' }}
										/>
										<h4 className={styles.name}>{operation.details.sender}</h4>
										<div style={{
											marginLeft: "auto"
										}}>
											<aside className={styles.description}>
												<h6 className={styles.amount} aria-describedby="hint">
													+ {toRublesStr(operation.details.amount)}
												</h6>
												<span id="hint" className={styles.from}>
											карта
										</span>
											</aside>
										</div>
									</div>
								)}
								{operation.operationType === OperationType.TRANSFER_OUT && (
									<div aria-label={`Перевод денежных средств, получатель - ${operation.details.recipient}`}>
										<div
											className={styles.avatar}
											style={{ background: '#FF0032' }}
										/>
										<h4 className={styles.name}>{operation.details.recipient}</h4>
										<button className={styles.toActions} onClick={() => handleSaveOperation(operation)}>
											<SaveCommand className={styles.saveIcon} />
										</button>
										<aside className={styles.description}>
											<h6 className={styles.amount}>
												- {toRublesStr(operation.details.amount)}
											</h6>
											<span className={styles.from}>карта</span>
										</aside>

									</div>
								)}
								{operation.operationType === OperationType.PAYMENT && (
									<div aria-label="Оплата">
										<div className={styles.iconAvatar}>
											<Phone width={20} height={20} />
										</div>
										{operation.details.paymentType === 'mobile' && (
											<h4 className={styles.name}>Оплата мобильной связи</h4>
										)}
										<button aria-label="Кнопка быстрого сохранения операции" className={styles.toActions} onClick={() => handleSaveOperation(operation)}>
											<SaveCommand className={styles.saveIcon} />
										</button>
										<aside className={styles.description}>
											<h6 className={styles.amount}>
												- {toRublesStr(operation.details.amount)}
											</h6>
											<span className={styles.from}>карта</span>
										</aside>
									</div>
								)}
							</div>
						))}
					</section>
				))}
			</div>
			<Micro aria-label="Микрофон голосового помощника" />
		</Page>
	)
}

export default History
