import { baseApi } from '@src/app/baseApi'
import { OperationDto } from '@src/app/services/operation/types'
import { OPERATION_TAG } from '@src/app/tags'

export const operationApi = baseApi.injectEndpoints?.({
	endpoints: (build) => ({
		operationsHistory: build.query<OperationDto[], void>({
			query: () => ({
				url: `operations/history`,
			}),
			providesTags: [OPERATION_TAG],
		}),
	}),
})

export const { useOperationsHistoryQuery } = operationApi
