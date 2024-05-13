import cl from 'classnames'
import { ComponentProps, useState } from 'react'

import styles from './styles.module.sass'

type HorizontalScrollProps = ComponentProps<'nav'> & {
	tabs: string[]
	handleClick: (tab: string) => void
}

const HorizontalScroll = ({
	tabs,
	handleClick,
	...props
}: HorizontalScrollProps) => {
	const [activeTab, setActiveTab] = useState(tabs[0])
	const tabClick = (tab: string) => {
		if (tab === activeTab) return
		handleClick(tab)
		setActiveTab(tab)
	}
	return (
		<nav {...props} className={cl(styles.container, props.className)}>
			{tabs.map((tab) => {
				const classname = cl(styles.tab, {
					[styles.activeTab]: tab === activeTab,
				})
				return (
					<div key={tab} className={classname} onClick={() => tabClick(tab)}>
						{tab}
					</div>
				)
			})}
		</nav>
	)
}

export default HorizontalScroll
