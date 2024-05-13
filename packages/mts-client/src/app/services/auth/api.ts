import { baseApi } from '@src/app/baseApi'
import { AtPayloadDto, LoginArgs } from '@src/app/services/auth/types'

export const authApi = baseApi.injectEndpoints({
	endpoints: (build) => ({
		login: build.mutation<AtPayloadDto, LoginArgs>({
			query: (body) => ({
				url: `auth/login`,
				method: 'POST',
				body,
			}),
		}),
		me: build.query<AtPayloadDto, void>({
			query: () => ({
				url: `auth/me`,
			}),
		}),
	}),
})

export const { useLoginMutation, useMeQuery } = authApi
