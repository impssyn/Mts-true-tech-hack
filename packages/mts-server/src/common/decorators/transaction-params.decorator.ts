import {createParamDecorator, ExecutionContext} from '@nestjs/common';
import {Request} from "express";
import {Transaction} from "sequelize";

/*
* Декоратор для получения параметра транзакции
* */
export const TransactionParams = createParamDecorator((data, ctx: ExecutionContext): Transaction | undefined => {
  const req: Request = ctx.switchToHttp().getRequest();
  return req['transaction'] as Transaction
})