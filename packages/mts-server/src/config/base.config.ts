import {registerAs} from "@nestjs/config";
import * as process from 'process';

export default registerAs('base', () => ({
  api_port: process.env.API_PORT || 3000,
  tcp_port: process.env.TCP_PORT || 3001,
  jwt_secret: process.env.JWT_SECRET,
  access_token_ttl_ms: 2*60*60*1000,
  refresh_token_ttl_ms: 14*24*60*60*1000,
  ai_server_url: process.env.AI_SERVER_URL
}));