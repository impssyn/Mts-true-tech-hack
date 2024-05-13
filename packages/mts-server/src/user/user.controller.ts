import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  UseInterceptors
} from "@nestjs/common";
import {CreateUserDto} from "./dto/create-user.dto";
import {UserService} from "./user.service";
import {UpdateUserDto} from "./dto/update-user.dto";
import {SuccessDto} from "../common/dto/success.dto";
import {ApiOkResponse, ApiParam} from "@nestjs/swagger";
import {UserRespDto} from "./dto/user-resp.dto";

@Controller('/session')
@UseInterceptors(ClassSerializerInterceptor)
export class UserController {
  constructor(
    private userService: UserService
  ) {}

  @ApiOkResponse({
    type: SuccessDto
  })
  @Post('/')
  async createUser(
    @Body() dto: CreateUserDto
  ): Promise<SuccessDto> {
    await this.userService.createUser(dto)
    return {
      success: true
    }
  }

  @ApiOkResponse({
    type: SuccessDto
  })
  @ApiParam({
    name: 'id',
    type: 'number',
    description: 'Идентификатор пользователя'
  })
  @Post('/:id')
  async updateUser(
    @Param('id', ParseIntPipe) userId: number,
    @Body() dto: UpdateUserDto
  ): Promise<SuccessDto> {
    await this.userService.updateUser(userId, dto)
    return {
      success: true
    }
  }

  @ApiOkResponse({
    type: UserRespDto
  })
  @ApiParam({
    name: 'id',
    type: 'number',
    description: 'Идентификатор пользователя'
  })
  @Get('/:id')
  async getUser(
    @Param('id', ParseIntPipe) userId: number,
  ): Promise<UserRespDto> {
    const data = await this.userService.getUserByIdOrThrow(userId)
    return new UserRespDto(data.toJSON())
  }
}