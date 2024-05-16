import {toRublesStr} from '@src/app/services/account/helpers'
import {useMyProductsQuery} from '@src/app/services/product/api'
import {
  useCheckTransferMutation,
  useTransferMutation,
} from '@src/app/services/transaction/api'
import {Ok, SendFree} from '@src/assets/svg'
import Input from '@src/components/Input'
import {FormEvent, useEffect, useState} from 'react'
import {toast} from 'react-toastify'

import styles from './transfers.module.sass'
import cardPng from '@assets/png/card.png'
import {useNavigate} from "react-router-dom";
import {useSearchParams} from "react-router-dom";
import {convert as convertNumberToWordsRu} from "number-to-words-ru";


const Transfers = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const sAmount = Number(searchParams.get("amount")) / 100
  const sRecipient = searchParams.get("recipient")
  const sDestAccountId = Number(searchParams.get("destAccountId"))
  const sBillingAccountId = Number(searchParams.get("billingAccountId"))

  const navigate = useNavigate()
  const [amount, setAmount] = useState<number>(sAmount || 0)
  const [number, setNumber] = useState('')
  const [isCard, setCard] = useState(false)
  const {data} = useMyProductsQuery()
  const [accountId, setAccountId] = useState(sBillingAccountId)
  const [checkTransfer] = useCheckTransferMutation()
  const [transfer] = useTransferMutation()

  const [isTransferAllowed, setIsTransferAllowed] = useState(sDestAccountId && sAmount && sRecipient)
  const [recipient, setRecipient] = useState(sRecipient || "")
  const [destAccountId, setDestAccountId] = useState(sDestAccountId || 0)

  useEffect(() => {
    if (data && data.cards.length) {
      setAccountId(data.cards[0].account.id)
    }
  }, [data]);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    e.stopPropagation()

    if (isTransferAllowed) {
      transfer({
        destAccountId,
        billingAccountId: accountId,
        amount: amount * 100
      }).unwrap().then((data) => {
        toast.success('Успешно отправлено')
        navigate('/history')
      }).catch(e => toast.error(e?.data?.message))
    } else {
      checkTransfer({
        amount: amount * 100,
        accountId,
        cardNumber: isCard ? number : undefined,
        phoneNumber: !isCard ? number : undefined,
      }).unwrap().then((data) => {
        setRecipient(data.recipient)
        setDestAccountId(data.destAccountId)
        setIsTransferAllowed(true)
      }).catch((e) => {
        toast.error(e?.data?.message)
      })
    }
  }
  return (
    <form
      aria-describedby="transfers"
      className={styles.container}
      onSubmit={handleSubmit}
    >
      <section className={styles.group}>

        {!isTransferAllowed && (
          <>
            <select
              className={styles.select}
              onChange={(e) => setCard(e.target.value === 'card')}
            >
              <option value="phone">По телефону:</option>
              <option value="card">По номеру карты:</option>
            </select>
            <Input
              onChange={(e) => {
                setNumber(e.target.value)
                setIsTransferAllowed(false)
                setRecipient("")
              }}
              placeholder="Введите номер..."
            ></Input>
          </>
        )}
        {!!isTransferAllowed && (
          <>
						<span style={{
              fontSize: "20px"
            }}>Получатель</span>
            <div style={{
              paddingLeft: "10px",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              cursor: "pointer"
            }}>
              <span>{recipient}</span>
              <span>
							<Ok width={20}/>
						</span>
            </div>
          </>
        )}
      </section>
      <section className={styles.group}>
        <select className={styles.select}>
          <option>С карты:</option>
        </select>
        {data?.cards.map(card => (
          <button
            type={"button"}
            key={card.account.id}
            className={styles.account}
            onClick={() => {
              setAccountId(card.account.id)
            }}
            style={{
              borderRadius: "10px",
              background: accountId === card.account.id ? "#f3f3f3" : "#fff"
            }}
            aria-label={`Карта ${Array.from(card.card.number.slice(-4)).join(' ')}. Баланс ${convertNumberToWordsRu(card.account.balance / 100)}`}
          >
            <img aria-hidden={"true"} className={styles.card} src={cardPng}/>
            <div style={{
              display: "flex",
              flexDirection: "column"
            }}>
              <h4 className={styles.name}>
                {card.card.number}
              </h4>
              <span className={styles.sum} >
									{toRublesStr(card.account.balance || 0)}
              </span>
            </div>
          </button>
        ))}
        <Input
          value={amount}
          onChange={(e) => {
            setAmount(Number(e.target.value))
            setIsTransferAllowed(false)
            setRecipient("")
          }}
          // type={"number"}
          placeholder="Введите сумму..."
        ></Input>
      </section>
      {/* <div className={styles.errorSpace}>текст ошибки</div> */}
      {isTransferAllowed ? (
        <button className={styles.sendButton} type="submit">
          Подтвердить
          <SendFree width={36} height={36} className={styles.sendIcon}/>
        </button>
      ) : (
        <button className={styles.sendButton} type="submit">
          Отправить
          <SendFree width={36} height={36} className={styles.sendIcon}/>
        </button>
      )}
    </form>
  )
}

export default Transfers
