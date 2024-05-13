import {ClassSerializerInterceptor, Controller, Get, UseInterceptors} from "@nestjs/common";
import {Auth} from "../auth/decorators/auth.decorator";
import {GetUser} from "../auth/decorators/get-user.decorator";
import {AtPayloadDto} from "../auth/dto/at-payload.dto";
import {OperationService} from "./operation.service";
import {OperationDto} from "./dto/operation.dto";

@Controller('/operations')
@UseInterceptors(ClassSerializerInterceptor)
export class OperationController {
  constructor(
    private operationService: OperationService
  ) {}

  @Get('/history')
  @Auth()
  async getMyHistory(
    @GetUser() user: AtPayloadDto,
  ) {
    const operations = await this.operationService.getUserOperations(user.id)
    return operations.map(operation => new OperationDto(operation.toJSON()))
  }
}