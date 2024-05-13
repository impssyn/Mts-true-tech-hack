import {Body, ClassSerializerInterceptor, Controller, Get, Post, UseInterceptors} from "@nestjs/common";
import {Auth} from "../auth/decorators/auth.decorator";
import {GetUser} from "../auth/decorators/get-user.decorator";
import {AtPayloadDto} from "../auth/dto/at-payload.dto";
import {CommandService} from "./command.service";
import {CreateCommandDto} from "./dto/create-command.dto";
import {SuccessDto} from "../common/dto/success.dto";
import {CommandDto} from "./dto/command.dto";
import {RecognizeCommandDto} from "./dto/recognize-command.dto";

@Controller('/commands')
@UseInterceptors(ClassSerializerInterceptor)
export class CommandController {
  constructor(
    private commandService: CommandService
  ) {}

  @Get('/my')
  @Auth()
  async getMyCommands(
    @GetUser() user: AtPayloadDto,
    @Body() dto: CreateCommandDto
  ): Promise<CommandDto[]> {
    const commands = await this.commandService.getUserCommands(user.id)
    return commands.map(command => new CommandDto(command.toJSON()))
  }

  @Post('/save')
  @Auth()
  async createCommand(
    @GetUser() user: AtPayloadDto,
    @Body() dto: CreateCommandDto
  ): Promise<SuccessDto> {
    await this.commandService.createCommand(user, dto)
    return {
      success: true
    }
  }

  @Post('/recognize')
  @Auth()
  async recognizeCommand(
    @GetUser() user: AtPayloadDto,
    @Body() dto: RecognizeCommandDto
  ) {
    const test = await this.commandService.recognizeCommand(user, dto)
    return test
  }
}