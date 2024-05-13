import { baseApi } from '@src/app/baseApi'
import {
	CreateUserCardArgs,
	ProductsDto,
} from '@src/app/services/product/types'
import { PRODUCT_TAG } from '@src/app/tags'
import { SuccessResponse } from '@src/app/types'

export const productApi = baseApi.injectEndpoints({
	endpoints: (build) => ({
		createUserCard: build.mutation<SuccessResponse, CreateUserCardArgs>({
			query: (body) => ({
				url: `products/cards`,
				method: 'POST',
				body,
			}),
			invalidatesTags: [PRODUCT_TAG],
		}),
		myProducts: build.query<ProductsDto, void>({
			query: () => ({
				url: `products/my`,
			}),
			providesTags: [PRODUCT_TAG],
		}),
	}),
})

export const { useMyProductsQuery, useCreateUserCardMutation } = productApi
