import { ComponentProps, ReactNode } from 'react'

import styles from './input.module.sass'

type InputProps = ComponentProps<'input'> & {
	children?: ReactNode | ReactNode[]
}

const Input = ({ ...props }: InputProps) => {
	return <input {...props} className={styles.input}></input>
}

export default Input
