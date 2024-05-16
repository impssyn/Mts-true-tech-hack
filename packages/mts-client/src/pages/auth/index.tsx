import { useLoginMutation } from '@src/app/services/auth/api'
import Input from '@src/components/Input'
import Logo from '@src/components/logo'
import Page from '@src/components/page'
import { FormEvent, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'

import styles from './styles.module.sass'

const authMethodSelectItems = [
	{
		value: 'username',
		selectText: 'логин',
		inputText: 'Введите логин',
		inputType: 'text',
	},
	{
		value: 'email',
		selectText: 'e-mail',
		inputText: 'Введите e-mail',
		inputType: 'email',
	},
	{
		value: 'phone',
		selectText: 'телефон',
		inputText: 'Введите телефон',
		inputType: 'tel',
	},
]

const Auth = () => {
	const navigate = useNavigate()
	// всего два поля, поэтому позволил себе сделать так, валидаций делать не будем, поэтому всякие библы с формами не нужны
	const [lpe, setLpe] = useState<string>('')
	const [pwd, setPwd] = useState<string>('')

	const [authMethodSelect, setAuthMethodSelect] = useState(
		authMethodSelectItems[0],
	)

	const [login] = useLoginMutation()

	const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault()
		login({
			lpe,
			pwd,
		})
			.then(() => {
				window.location.assign('/')
			})
			.catch((e) => {
				toast.error(e)
			})
	}

	return (
		<Page>
			<Logo />
			<form className={styles.container} onSubmit={handleSubmit}>
				<div>
					<h2 aria-describedby="hint" className={styles.h2}>
						Вход
					</h2>
					<p id="hint" className={styles.hint}>
						Авторизуйтесь по логину, телефону или электронной почте
					</p>
				</div>
				<select
					aria-describedby="login-hint"
					className={styles.select}
					onChange={(e) =>
						setAuthMethodSelect(
							authMethodSelectItems.find(
								(m) => m.value === e.currentTarget.value,
							) as any,
						)
					}
					value={authMethodSelect.value}
				>
					{authMethodSelectItems.map((method) => (
						<option key={method.value} value={method.value}>
							{method.selectText}:
						</option>
					))}
				</select>
				<Input
					id="login-hint"
					type={authMethodSelect.inputType}
					placeholder={authMethodSelect.inputText}
					value={lpe}
					onChange={(e) => setLpe(e.target.value)}
				></Input>
				<span id="password-hint" className={styles.passwordHint}>
					пароль:
				</span>
				<Input
					aria-describedby="password-hint"
					autoComplete="on"
					type="password"
					placeholder="Введите пароль"
					value={pwd}
					onChange={(e) => setPwd(e.target.value)}
				></Input>
				<button className={styles.enter} type="submit">
					Войти
				</button>
			</form>
		</Page>
	)
}

export default Auth
