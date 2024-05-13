import {Body, Controller, Get, Post, Res} from "@nestjs/common";
import {LoginDto} from "./dto/login.dto";
import {AuthService} from "./auth.service";
import {Response} from 'express';
import {ConfigService} from "@nestjs/config";
import {ApiCookieAuth, ApiOkResponse, ApiResponse} from "@nestjs/swagger";
import {SuccessDto} from "../common/dto/success.dto";
import {AtPayloadDto} from "./dto/at-payload.dto";
import {Auth} from "./decorators/auth.decorator";
import {GetUser} from "./decorators/get-user.decorator";

@Controller('/auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private configService: ConfigService
  ) {}

  @ApiOkResponse({
    type: AtPayloadDto,
    description: 'Аутентификация прошла успешно'
  })
  @Post('/login')
  async login(
    @Body() dto: LoginDto,
    @Res({passthrough: true}) res: Response
  ): Promise<AtPayloadDto> {
    const {token, payload} = await this.authService.login(dto)
    const tokenTtl = this.configService.getOrThrow('base.access_token_ttl_ms')

    res.cookie(
      'at',
      token,
      {
        httpOnly: true,
        expires: new Date(Date.now() + tokenTtl),
        maxAge: tokenTtl
      }
    );

    return payload
  }

  @Get('/me')
  @Auth()
  async me(
    @GetUser() user: AtPayloadDto,
  ): Promise<AtPayloadDto> {
    return user
  }
}