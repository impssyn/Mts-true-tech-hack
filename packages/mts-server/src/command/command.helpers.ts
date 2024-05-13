import {Command} from "./models/command.model";

export const searchCommandByRawText = (commands: Command[], text: string) => {
  const foundCommands =  commands.filter(
    command => command.text.toLowerCase().search(text.toLowerCase()) !== -1
  )
  console.log(foundCommands)
  if (!foundCommands.length) return null
  return foundCommands[0]
}