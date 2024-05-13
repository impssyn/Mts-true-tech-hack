import {Microphone} from '@assets/svg'
import {useRecognizeMutation,} from '@src/app/services/command/api'
import {getTextToSpeech} from '@shared/lib/textToSpeech'
import cl from 'classnames'
import {ComponentProps, memo, MouseEvent, useEffect, useRef, useState,} from 'react'
import SpeechRecognition, {useSpeechRecognition,} from 'react-speech-recognition'
import {toast} from 'react-toastify'

import style from './micro.module.sass'
import {CommandType} from "@src/app/types";
import {useNavigate} from "react-router-dom";

type MicroProps = ComponentProps<'button'> & {
  large?: boolean
  simple?: boolean
  onChangeText?: (s: string) => void
}

const synth = window.speechSynthesis;
const SOUND_STOP_DELAY = 1000

const Micro = memo(({large = false, simple = false, onChangeText = undefined, ...props}: MicroProps) => {
  const navigate = useNavigate()

  const className = cl(props.className, style.button, {
    [style.large]: large,
    [style.small]: !large,
  })
  const [recognize] = useRecognizeMutation()

  const buttonRef = useRef<HTMLButtonElement>(null)
  const transcriptRef = useRef('')
  const recognizedRef = useRef(false)

  const {
    transcript,
    browserSupportsSpeechRecognition,
    isMicrophoneAvailable,
  } = useSpeechRecognition({
    commands: [
      // сюда пихнуть итоговые myCommands по примеру ниже
      {
        command: 'Тестовая команда',
        bestMatchOnly: true,
        callback: () => {
          recognizedRef.current = true
          toast.success('Команда А распознана: ' + recognizedRef.current)
        },
      },
    ],
  })

  const speak = (textValue: string) => {
    const synth = window.speechSynthesis;
    const utterance = new SpeechSynthesisUtterance(textValue);
    // utterance.voice = synth.getVoices()[4];
    utterance.voice = synth.getVoices()[4]
    window.speechSynthesis.speak(utterance);
  }


  const [text, setText] = useState('текст')
  const [audioURL, setAudioURL] = useState('')
  const handleAudioFetch = async (text: string) => {
    const data = await getTextToSpeech(text)
    const blob = new Blob([data], {type: 'audio/mpeg'})
    const url = URL.createObjectURL(blob)
    setAudioURL(url)
  }

  const handleStart = (e: MouseEvent<HTMLButtonElement>) => {
    setAudioURL('')
    // speechSynthesis.pause()
    if (!browserSupportsSpeechRecognition) {
      return toast.error("Browser doesn't support speech recognition.")
    }
    if (!isMicrophoneAvailable) {
      return toast.error('Микрофон недоступен')
    }
    SpeechRecognition.startListening({language: 'ru'})

    // ripples effect
    const overlay = document.createElement('span')
    overlay.classList.add(style.overlay)
    const [x, y] = [e.nativeEvent.offsetX, e.nativeEvent.offsetY]

    overlay.style.left = x + 'px'
    overlay.style.top = y + 'px'
    buttonRef.current?.appendChild(overlay)
    setTimeout(() => overlay.remove(), 500)
  }

  const handleStop = () => {
    SpeechRecognition.stopListening()
    setTimeout(() => {
      if (!browserSupportsSpeechRecognition) return
      if (!isMicrophoneAvailable) return
      if (recognizedRef.current === true) return
      recognizedRef.current = false
      if (transcriptRef.current === '') return

      if (simple) {
        return onChangeText?.(transcriptRef.current)
      }
      console.log('test')
      recognize({text: transcriptRef.current}).then(({data}) => {
        if (data.commandType === CommandType.TRANSFER) {
          navigate(`/transactions/?amount=${data.params.amount}&recipient=${data.params.recipient}&destAccountId=${data.params.destAccountId}&billingAccountId=${data.params.billingAccountId}`)
        }
        if (data.commandType === CommandType.PAYMENT) {
          console.log(
            'payment',
            data.params
          )
        }
        data.text && speak(data.text)
      })
    }, SOUND_STOP_DELAY)
  }

  useEffect(() => {
    transcriptRef.current = transcript
  }, [transcript])

  return (
    <>
      <button
        {...props}
        ref={buttonRef}
        className={className}
        onPointerDown={handleStart}
        onPointerUp={handleStop}
      >
        <Microphone width={56} height={56} className={style.microphone}/>
        {large && 'Зажмите и удерживайте'}
      </button>
      {audioURL && (
        <audio id="audio" autoPlay controls className={cl(style.audio)}>
          <source src={audioURL} type="audio/mpeg"/>
        </audio>
      )}
    </>
  )
})

export default Micro
