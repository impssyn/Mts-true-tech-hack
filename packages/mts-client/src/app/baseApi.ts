import { createApi } from '@reduxjs/toolkit/query/react'
import { baseQuery } from '@src/app/baseQuery'
import { OPERATION_TAG, PRODUCT_TAG, USER_TAG } from '@src/app/tags'

export const baseApi = createApi({
	tagTypes: [USER_TAG, OPERATION_TAG, PRODUCT_TAG],
	reducerPath: 'api',
	baseQuery,
	endpoints: () => ({}),
})
