import { NestFactory } from '@nestjs/core';
import {MicroserviceOptions, Transport} from "@nestjs/microservices";
import {ConfigService} from "@nestjs/config";
import * as cookieParser from 'cookie-parser';
import {useContainer} from "class-validator";
import {ValidationPipe} from "@nestjs/common";
import { AppModule } from './app/app.module';
import * as process from "process";
import {DocumentBuilder, SwaggerModule} from "@nestjs/swagger";
// import {ValidationPipe} from "./common/pipes/validation.pipe";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: true,
    credentials: true,
  });

  // const configService = app.get(ConfigService);
  // const apiPort = configService.getOrThrow('base.api_port');
  // const tcpPort = configService.getOrThrow('base.tcp_port');
  // app.connectMicroservice<MicroserviceOptions>({
  //   transport: Transport.TCP,
  //   options: {
  //     port: tcpPort
  //   }
  // });
  //
  // // https://github.com/typestack/class-validator#using-service-container
  // useContainer(app.select(AppModule), { fallbackOnErrors: true });

  const config = new DocumentBuilder()
    .setTitle('API MTS')
    .setDescription('Описание API хакатона MTS')
    .setVersion('1.0')
    .addTag('mts')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  app.use(cookieParser());
  app.useGlobalPipes(new ValidationPipe());

  // await app.startAllMicroservices();
  await app.listen(3000);
}

bootstrap();
