import {User} from "./models/user.model";

export const getHiddenName = (user: User) => {
  return `${user.lastName} ${user.firstName[0].toUpperCase()}. ${user.patronymic[0].toUpperCase()}.`
}