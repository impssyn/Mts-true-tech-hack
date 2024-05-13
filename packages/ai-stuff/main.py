from openai import OpenAI
import json
from API_key import OPEN_API_KEY
import phonenumbers
from fastapi import FastAPI
from pydantic import BaseModel

## TODO: Распознавание типа "цели" адрес, тип адреса, количество в копейках

currency_list = "рубли/рубля/рубль/рублей, копейки/копейка/копеек/копейку, евро, доллары/доллар"

command_list = f"""\\
    1) TRANSFER address amount - означает перевод денежных средств с переданными параметрами.
Описание параметров:
 - address - НОМЕР КАРТЫ (в номере карты 16 цифр) или НОМЕР ТЕЛЕФОНА (в номере телефона 10 цифр) получателя или "error", если не найдено.

- amount - сумма перевода в РУБЛЯХ или "error", если не найдено, если во фразе указана сумма в копейках, то нужно перевести в рубли, в рубле 100 копеек.

2) BALANCE targetType target - означает просмотр баланса клиента
Описание параметров:

- targetType - обязательный аргумент, может принимать четыре значения: "card_number", "debit", "credit", "full" по следующим правилам:
"card_number" - если указан номер карты, с которого нужно просмотреть баланс
"debit" - если не указан номер карты, но сказано, что карта ДЕБЕТОВАЯ
"credit" - если не указан номер карты, но сказано, что карта КРЕДИТНАЯ
"full" - во всех остальных случаях

-target - принимает значения по следующим правилам:
если = "card_number", то - НОМЕР КАРТЫ или ЧАСТЬ НОМЕРА КАРТЫ или "error", если не найдено 
если = "debit", то - пустой аргумент
если = "credit", то - пустой аргумент
если = "full", то - пустой аргумент

3) CREDENTIALS credtialsType targetType target - означает просмотр данных карты, информации о карте
Описание параметров:

- credentialsType - обязательный аргумент, может принимать четыре значения: "card_number", "cvv", "date" по следующим правилам:
"card_number" - если просят номер карты
"cvv" - если просят cvv (код на обратной стороне карты) 
"date" - если просят дату окончания действия карты (дату на карте)
"pin" - если просят пин-код
"full" - если просят все данные карты или не уточнили что просят

- targetType - обязательный аргумент, может принимать четыре значения: "card_number", "debit", "credit" по следующим правилам:
"card_number" - если указан номер карты
"debit" - если не указан номер карты, но сказано, что карта ДЕБЕТОВАЯ
"credit" - если не указан номер карты, но сказано, что карта КРЕДИТНАЯ

-target - необязательный аргумент, принимает значения по следующим правилам:
если targetType = "card_number", то - НОМЕР КАРТЫ или ЧАСТЬ НОМЕРА КАРТЫ или "error", если не найдено 
если targetType = "debit", то - пустой аргумент
если targetType = "credit", то - пустой аргумент

Есть фраза: Я хочу просмотреть баланс карты, оканчивающейся на 9875. Сопоставь эту фразу с командой выше или выведи ERROR, если не удалось сопоставить.
Примеры:
1) Переведи 500 рублей по телефону 8 9 0 5 0 170 80 0 - TRANSFER 89050170800 500
2) Я хочу, чтобы ты перевел 1000 рублей по карте 1234 5678 9876 5432 - TRANSFER 1234567898765432 1000
3) Покажи баланс - BALANCE full
4) Покажи общий баланс - BALANCE full
5) Покажи баланс дебетовой карты - BALANCE debit
6) Мне нужен баланс моей кредитной карты - BALANCE credit
7) Покажи баланс карты 8754 - BALANCE card_number 8754
8) Покажи мне баланс карты - BALANCE card_number error
9) Переведи 1000 рублей - TRANSFER error 1000
10) Переведи на номер 89050170800 - TRANSFER 89050170800 error
11) Пошли двадцать рублей на карту - TRANSFER error 20
12) Переведи на номер 89050170800 - TRANSFER +79050170800 error
13) Покажи мне код карты 8746 - CREDENTIALS cvv card_number 8746
14) Покажи мне код карты - CREDENTIALS cvv card_number error
15) Мне нужны данные карты 2345 - CREDENTIALS full card_number 2345
16) Мне нужна дата окончания действия карты 1234 - CREDENTIALS date card_number 1234
17) Я бы хотел посмотреть данные дебетовой карты - CREDENTIALS full debit
18) Мне нужны данные карты - CREDENTIALS full error
19) Покажи мне данные карты, которая оканчивается на 1246 - CREDENTIALS full card_number 1246
20) Покажи мне пин-код карты карты 1234 - CREDENTIALS pin card_number 1234
21) Баланс моего счета на экран - BALANCE full
22) Общий баланс счета 1111 - BALANCE card_number 1111
23) Баланс по карте 2222 - BALANCE card_number 2222
24) Сколько денег на моей карте - BALANCE card_number error
25) Отправь деньги на карту 3333333333333333 - TRANSFER 3333333333333333 error
26) Отправь 100р на карту 4444444444444444 - TRANSFER 4444444444444444 100
27) Отправь 100 р на счет 5555555555555555 - TRANSFER 5555555555555555 100
28) Зашли 200р на карту 7777777777777777 - TRANSFER 7777777777777777 200
29) Какой пин-код на карте 3333 - CREDENTIALS pin card_number 3333
30) Код безопасности карты 4444 - CREDENTIALS cvv card_number 3333
31) Номер счета по карте 9999 - CREDENTIALS card_number card_number 9999
32) Срок действия карты 6666 - CREDENTIALS date card_number 6666
33) Покажи баланс карты - BALANCE card_number error
34) Покажи до какого числа карта 1235 - CREDENTIALS date card_number 1235
35) Покажи до какого числа действует карта 1235 - CREDENTIALS date card_number 1235

    """
# Добавить запрос сразу нескольких параметров
app = FastAPI()

client = OpenAI(
    api_key=OPEN_API_KEY,
    base_url="https://api.proxyapi.ru/openai/v1",
)

def parse_to_json(response_list):
    output = {}
    match response_list[0]:
        case "ERROR":
            output.update({"status":"error"})
            # try:
            #     output.update({"errorType":response_list[1]})
            # except IndexError:
            output.update({"errorType":"recognition_error"})
        case "TRANSFER":
            output.update({"status":"ok"})
            output.update({"type":"transfer"})
            output.update({"params":{}})
            if response_list[1] == "error":
                output.update({"status":"error"})
                output.update({"errorType":"wrong_address"})
            else:
                output["params"].update({"address":response_list[1]})
                output["params"].update({"addressType":response_list[2]})
                if output["params"]["addressType"] == "phone_number":
                    output["params"]["address"] = "+7"+str(output["params"]["address"])
            if response_list[3] != "error":
                output["params"].update({"amount":float(response_list[3])*100})
            else:
                output.update({"status":"error"})
                output.update({"errorType":"wrong_amount"})
            
        case "BALANCE":
            output.update({"status":"ok"})
            output.update({"type":"balance"})
            output.update({"params":{}})
            if len(response_list) > 1:
                output["params"].update({"targetType":response_list[1]})
                if response_list[1] == "card_number":
                    if response_list[2] != "error":
                        output["params"].update({"target":response_list[2]})
                    else:
                        output.update({"status":"error"})
                        output.update({"errorType":"wrong_target"})
        case "CREDENTIALS":
            output.update({"status":"ok"})
            output.update({"type":"credentials"})
            output.update({"params":{}})
            output["params"].update({"credentialsType":response_list[1]})
            output["params"].update({"targetType":response_list[2]})
            if response_list[2] == "card_number":
                if response_list[3] != "error":
                    output["params"].update({"target":response_list[3]})
                else:
                    output.update({"status":"error"})
                    output.update({"errorType":"wrong_card"})
    return output

# parse_to_json(["ERROR"])

@app.get("/recognition")
async def recognition(phrase: str = None):
    response = client.chat.completions.create(
        model="gpt-3.5-turbo",
        messages=[
            {"role": "system", "content": "Есть команды: \n"+command_list+"\nВыведи мне только команду."
            },
            {"role": "user", "content": phrase}
        ],
    )
    print(response.choices[0].message.content)
    out = (response.choices[0].message.content).split()
    if out[0] == "TRANSFER":
        try:
            adress = phonenumbers.parse(out[1], "RU")
            if phonenumbers.is_valid_number(adress) and phonenumbers.is_possible_number(adress):
                out.insert(2, "phone_number")
                out[1] = adress.national_number
            else:
                out.insert(2, "card_number")
        except phonenumbers.phonenumberutil.NumberParseException:
            out.insert(2, "card_number")

    return parse_to_json(out)

@app.post("/phrase")
async def phrase_match(saved_phrases: list = None, match_phrase: str = None):
    saved_phrases = ["Переведи маме",
                    "Переведи бабушке",
                    "Чиферни моему кентану",
                    "Переведи папе"]
    response = client.chat.completions.create(
        model="gpt-3.5-turbo",
        messages=[
            {"role": "system", "content": "Сопоставь фразу, которую я тебе дам, чтобы она была похожа с одной фразой из списка. \n \\\
             Если фраза совпадает с одной из списка, тогда выведи номер фразы, начиная с 0.\n \\\
             Если не совпадает со списком фраз, тогда выведи -1.\n \\\
             Чиферни = переведи, кенту = кентану, кент = кентан, маме = матери, папе = отцу, папе = бате, папе = батосу, бабушке = бабке, бабушке = старухе. \n \\\
             Список фраз: \n"+"\n".join(saved_phrases)
            },
            {"role": "user", "content": match_phrase}
        ],
    )
    print(response.choices[0].message.content)
    return response.choices[0].message.content


print('\n')
# print(recognition(phrase = "Покажи баланс"))
# print(phrase_match(match_phrase="Чиферни батосу"))
print('\n')


#Баланс, с аргументом, поиск карты по её окончанию.Уточнение карты по её типу. без аргументов - ответ по всем
#
#
#Добавить позже
#Инфо о карте, (номер карты)
#
#
#