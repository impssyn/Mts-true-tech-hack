import { AuthGuard } from '@components/AuthGuard'
import Auth from '@pages/auth'
import Balance from '@pages/balance'
import Main from '@pages/main'
import Transactions from '@pages/transactions'
import Actions from '@src/pages/actions'
import History from '@src/pages/history'
import { createBrowserRouter } from 'react-router-dom'
import {SaveCommand} from "@pages/saveCommand";

const router = createBrowserRouter([
	{
		path: '/',
		element: (
			<AuthGuard>
				<Main />
			</AuthGuard>
		),
	},
	{
		path: '/auth',
		element: <Auth />,
	},
	{
		path: '/balance',
		element: <Balance />,
	},
	{
		path: '/transactions',
		element: <Transactions />,
	},
	{
		path: '/actions',
		element: <Actions />,
	},
	{
		path: '/history',
		element: <History />,
	},
	{
		path: '/saveCommand',
		element: <SaveCommand />
	},
	{
		path: '*',
		element: <div>Error URL</div>,
	},
])

export default router
