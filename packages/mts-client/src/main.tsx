import { store } from '@src/app/store'
import React from 'react'
import ReactDOM from 'react-dom/client'
import { Provider as ReduxProvider } from 'react-redux'
import 'regenerator-runtime/runtime'

import App from './components/App'
import ToastCustom from './components/ToastCustom'

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement)

root.render(
	<React.StrictMode>
		<ReduxProvider store={store}>
			<ToastCustom />
			<App />
		</ReduxProvider>
	</React.StrictMode>,
)
