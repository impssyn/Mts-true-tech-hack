import { baseApi } from '@src/app/baseApi'
import {
	CreateUserArgs,
	UpdateUserArgs,
	UserDto,
} from '@src/app/services/user/types'
import { USER_TAG } from '@src/app/tags'
import { SuccessResponse } from '@src/app/types'

export const userApi = baseApi.injectEndpoints?.({
	endpoints: (build) => ({
		createUser: build.mutation<SuccessResponse, CreateUserArgs>({
			query: (body) => ({
				url: `users`,
				method: 'POST',
				body,
			}),
			invalidatesTags: [USER_TAG],
		}),
		updateUser: build.mutation<SuccessResponse, UpdateUserArgs>({
			query: ({ userId, ...body }) => ({
				url: `users/${userId}`,
				method: 'POST',
				body,
			}),
			invalidatesTags: [USER_TAG],
		}),
		getUser: build.query<UserDto, { userId: number }>({
			query: ({ userId }) => ({
				url: `users/${userId}`,
			}),
			providesTags: [USER_TAG],
		}),
	}),
})

export const { useCreateUserMutation, useUpdateUserMutation, useGetUserQuery } =
	userApi
