import cl from 'classnames'
import { ComponentProps, ReactNode } from 'react'

import styles from './page.module.sass'
import themes from '@shared/styles/_themes.module.sass'

type PageProps = ComponentProps<'main'> & {
	children: ReactNode | ReactNode[]
}

const theme = 'light'

const Page = ({ children, ...props }: PageProps) => {
	const classname = cl(themes[theme], props.className, styles.page)
	return (
		<main {...props} className={classname}>
			{children}
		</main>
	)
}

export default Page
