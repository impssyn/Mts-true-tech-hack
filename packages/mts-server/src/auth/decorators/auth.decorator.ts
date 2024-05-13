import {applyDecorators, SetMetadata, UseGuards} from '@nestjs/common';
import {AuthGuard} from "../guards/auth.guard";
import {RolesGuard} from "../guards/roles.guard";

/*
* Декоратор для аутентификации и авторизации пользователя.
* */
export function Auth(authParams?: {manager: true}) {
  return applyDecorators(
    SetMetadata('authParams', authParams),
    UseGuards(AuthGuard, RolesGuard),
  );
}
