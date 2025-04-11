import { registerAs } from '@nestjs/config';

export default registerAs('jwt', () => ({
  secret: process.env.JWT_SECRET_KEY,
  audience: process.env.JWT_AUDIENCE,
  issuer: process.env.JWT_ISSUER,
  accessTokenTTL: parseInt(process.env.JWT_ACCESS_TOKEN_TTL) ?? 86400,
}));
