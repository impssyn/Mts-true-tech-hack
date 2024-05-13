import {CanActivate, ExecutionContext, Injectable, UnauthorizedException,} from '@nestjs/common';

import {Request} from 'express';
import {JwtService} from "../jwt.service";
import {AtPayloadDto} from "../dto/at-payload.dto";

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private jwtService: JwtService
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);

    if (!token) {
      throw new UnauthorizedException();
    }

    const decoded = this.jwtService.verify<AtPayloadDto>(token);
    if (!decoded) {
      throw new UnauthorizedException();
    }

    request['user'] = decoded
    return true;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    if (
      request.headers.authorization &&
      request.headers.authorization.startsWith('Bearer')
    ) {
      return request.headers.authorization.split(' ')[1];
    } else if (request.cookies.at) {
      return request.cookies.at;
    }
  }
}
