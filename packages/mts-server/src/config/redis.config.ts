import {registerAs} from "@nestjs/config";
import * as process from 'process';

export default registerAs('redis-client', () => ({
  host: process.env.REDIS_HOST,
  username: process.env.REDIS_USERNAME,
  password: process.env.REDIS_PASSWORD,
  port: process.env.REDIS_PORT || 6379,
}));