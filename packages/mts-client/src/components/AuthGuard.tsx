import { useMeQuery } from '@src/app/services/auth/api'
import { ReactElement } from 'react'
import { Navigate } from 'react-router-dom'

type Props = {
	isAdminMethod?: boolean
	children: ReactElement
}

export function AuthGuard({ isAdminMethod, children }: Props) {
	const { data: user, error } = useMeQuery()

	if (error) return <Navigate to="/auth" />

	if (user) {
		if (isAdminMethod && user?.isManager) {
			return <Navigate to="/" />
		}

		return children
	}
}
