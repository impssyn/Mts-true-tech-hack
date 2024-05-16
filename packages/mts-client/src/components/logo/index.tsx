import styles from './logo.module.sass'
import {useNavigate} from "react-router-dom";

const Logo = () => {
	const navigate = useNavigate()
	return (
		<header className={styles.container} onClick={() => navigate('/')}>
			<h1 className={styles.h1}>МТС</h1>
			<span className={styles.add}>talk</span>
		</header>
	)
}

export default Logo
