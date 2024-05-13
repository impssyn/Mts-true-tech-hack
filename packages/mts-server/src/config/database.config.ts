import {registerAs} from "@nestjs/config";
import * as process from 'process';

export default registerAs('database', () => ({
  db_name: process.env.POSTGRES_DB,
  host: process.env.POSTGRES_HOST,
  port: process.env.POSTGRES_PORT || 5432,
  user: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
}));