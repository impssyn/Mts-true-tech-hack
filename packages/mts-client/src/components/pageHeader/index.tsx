import { ComponentProps, ReactNode } from 'react'

import styles from './pageHeader.module.sass'

type PageHeaderProps = ComponentProps<'header'> & {
	children: ReactNode | ReactNode[]
}
const PageHeader = ({ ...props }: PageHeaderProps) => {
	return <header {...props} className={styles.container}></header>
}

export default PageHeader
