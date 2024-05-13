import { baseApi } from '@src/app/baseApi'
import {
	CheckTransferArgs,
	CheckTransferDto,
	PayArgs,
	TransferArgs,
} from '@src/app/services/transaction/types'
import { OPERATION_TAG } from '@src/app/tags'
import { SuccessResponse } from '@src/app/types'

export const transactionApi = baseApi.injectEndpoints?.({
	endpoints: (build) => ({
		checkTransfer: build.mutation<CheckTransferDto, CheckTransferArgs>({
			query: (body) => ({
				url: `transaction/transfer/check`,
				method: 'POST',
				body,
			}),
			providesTags: [OPERATION_TAG]
		}),
		transfer: build.mutation<SuccessResponse, TransferArgs>({
			query: (body) => ({
				url: `transaction/transfer`,
				method: 'POST',
				body,
			}),
			invalidatesTags: [OPERATION_TAG],
		}),
		pay: build.mutation<SuccessResponse, PayArgs>({
			query: (body) => ({
				url: `transaction/transfer/pay`,
				method: 'POST',
				body,
			}),
			invalidatesTags: [OPERATION_TAG],
		}),
	}),
})

export const { useCheckTransferMutation, useTransferMutation, usePayMutation } =
	transactionApi
