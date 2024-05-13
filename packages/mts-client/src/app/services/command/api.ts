import { baseApi } from '@src/app/baseApi'
import { SaveCommandArgs } from '@src/app/services/command/types'
import {
	CommandDto,
	RecognizedCommandDto,
	SuccessResponse,
} from '@src/app/types'

export const commandApi = baseApi.injectEndpoints?.({
	endpoints: (build) => ({
		saveCommand: build.mutation<SuccessResponse, SaveCommandArgs>({
			query: (body) => ({
				url: `commands/save`,
				method: 'POST',
				body,
			}),
		}),
		myCommands: build.query<CommandDto[], void>({
			query: () => ({
				url: `commands/my`,
			}),
		}),
		recognize: build.mutation<
			RecognizedCommandDto,
			{
				text: string
			}
		>({
			query: (body) => ({
				url: `commands/recognize`,
				method: 'POST',
				body,
			}),
		}),
	}),
})

export const {
	useSaveCommandMutation,
	useMyCommandsQuery,
	useRecognizeMutation,
} = commandApi
