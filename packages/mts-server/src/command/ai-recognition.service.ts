import {Injectable} from "@nestjs/common";
import {IAiRecognizedCommand} from "./interfaces/ai-recognized-command.interface";
import axios from "axios";
import {ConfigService} from "@nestjs/config";

@Injectable()
export class AiRecognitionService {
  constructor(
    private configService: ConfigService
  ) {}

  private aiServerUrl = this.configService.getOrThrow('base.ai_server_url')

  async recognizeCommand(text: string): Promise<IAiRecognizedCommand> {
    const response = await axios.get(`http://ai-stuff/recognition?phrase=${text}`)
    console.log(response.data)
    return response.data as IAiRecognizedCommand
  }
}