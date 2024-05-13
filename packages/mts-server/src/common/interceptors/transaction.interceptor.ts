import {Sequelize} from "sequelize-typescript";
import {CallHandler, ExecutionContext, Injectable, NestInterceptor} from "@nestjs/common";
import {catchError, Observable, tap, throwError} from "rxjs";
import {Transaction} from "sequelize";
import {InjectConnection} from "@nestjs/sequelize";


/*
* Промежуточное по для работы с транзакциями.
* Добавляет в объект request созданную транзакцию, после выполнения автоматически либо принимает изменения, либо отменяет их.
* */
@Injectable()
export class TransactionInterceptor implements NestInterceptor {
  constructor(
    @InjectConnection()
    private readonly sequelizeInstance: Sequelize
  ) {
  }

  async intercept(
    context: ExecutionContext,
    next: CallHandler
  ): Promise<Observable<any>> {
    const httpContext = context.switchToHttp();
    const req = httpContext.getRequest();

    const transaction: Transaction = await this.sequelizeInstance.transaction();
    req.transaction = transaction;
    return next.handle().pipe(
      tap(() => {
        transaction.commit();
      }),
      catchError(err => {
        transaction.rollback();
        return throwError(() => err);
      })
    );
  }
}