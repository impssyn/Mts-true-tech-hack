import {Navigate, useNavigate, useSearchParams} from "react-router-dom";
import styles from "@pages/history/styles.module.sass";
import PageHeader from "@components/pageHeader";
import Page from "@components/page";
import Input from "@components/Input";
import {toast} from "react-toastify";
import {useEffect, useState} from "react";
import {useSaveCommandMutation} from "@src/app/services/command/api";
import Micro from "@components/micro";

export const SaveCommand = () => {
  const navigate = useNavigate()
  const [searchParams, setSearchParams] = useSearchParams();
  const operationId = Number(searchParams.get("operationId"))
  const [commandText, setCommandText] = useState("")

  if (!operationId)
    return <Navigate to={"/"} />

  const [saveCommand] = useSaveCommandMutation()

  const handleSubmit = (e: any) => {
    e.preventDefault()
    if (commandText) {
      saveCommand({
        operationId,
        text: commandText
      }).unwrap().then((data) => {
        toast.success('Команда успешно добавлена')
        navigate('/actions')
      } )
    } else {
      toast.error('Введите команду')
    }
  }

  return (
    <Page aria-describedby="header" className={styles.container}>
      <PageHeader id="header">Добавить новую команду</PageHeader>
      <form style={{
        width: "100%",
        paddingTop: "10px"
      }}
      onSubmit={handleSubmit}>
        <Input
          value={commandText}
          onChange={(e) => setCommandText(e.target.value)}
          placeholder={"Введите команду"} style={{
          marginBottom: "10px"
        }} />
        <div style={{
          display: "flex",
          justifyContent: "center"
        }}>
          <button
            type={"submit"}
            style={{
              cursor: "pointer",
              width: "100%",
              fontSize: "20px",
              background: "#de5050",
              color: "#fff",
              padding: "15px",
              borderRadius: "15px"
            }}>
            Сохранить
          </button>
        </div>
      </form>

      <Micro aria-describedby="Микрофон голосового помощника" simple={true} onChangeText={(text) => setCommandText(text)}/>
    </Page>
  )
}