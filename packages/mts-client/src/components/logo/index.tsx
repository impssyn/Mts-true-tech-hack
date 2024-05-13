import styles from './logo.module.sass'

const Logo = () => {
	return (
		<header className={styles.container}>
			<h1 className={styles.h1}>МТС</h1>
			<span className={styles.add}>talk</span>
		</header>
	)
}

export default Logo
