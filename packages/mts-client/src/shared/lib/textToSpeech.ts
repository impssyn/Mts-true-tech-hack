import axios from 'axios'

const key = import.meta.env.VITE_ELEVENLABS_API_KEY
const VOICE_ID = 'Dvfxihpdb69LFIkmih0k' // https://elevenlabs.io/app/voice-library
const url = `https://api.elevenlabs.io/v1/text-to-speech/${VOICE_ID}`
export const getTextToSpeech = async (text: string) => {
	const options = {
		method: 'POST',
		url: url,
		headers: {
			accept: 'audio/mpeg',
			'content-type': 'application/json',
			'xi-api-key': key,
		},
		data: {
			text: text,
			model_id: 'eleven_multilingual_v2',
			voice_settings: {
				use_speaker_boost: true,
				stability: 0.5,
				similarity_boost: 0.5
			}
		},
		responseType: 'arraybuffer',
	}
	const speechDetails = await axios.request(options)
	// console.log(speechDetails)
	return speechDetails.data
}
