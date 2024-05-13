import {CanActivate, ExecutionContext, Injectable, UnauthorizedException} from '@nestjs/common';
import {Reflector} from '@nestjs/core';
import {AtPayloadDto} from "../dto/at-payload.dto";


@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const authParams = this.reflector.get<{manager: boolean}>(
      'authParams',
      context.getHandler(),
    );

    const req = context.switchToHttp().getRequest();
    const user: AtPayloadDto = req.user;

    if (!user) {
      throw new UnauthorizedException()
    }

    return !(authParams?.manager && !user.isManager)
  }
}
