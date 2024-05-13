import { Bounce, ToastContainer, ToastContainerProps } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

const ToastCustom = () => {
	const options: ToastContainerProps = {
		position: 'top-right',
		autoClose: 5000,
		hideProgressBar: false,
		newestOnTop: false,
		closeOnClick: true,
		rtl: false,
		pauseOnFocusLoss: true,
		draggable: true,
		pauseOnHover: true,
		theme: 'light',
		transition: Bounce,
	}
	return <ToastContainer {...options} />
}

export default ToastCustom
