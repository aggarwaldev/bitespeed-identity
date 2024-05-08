import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { BackendModule } from './backend.module';

async function bootstrap() {
  const app = await NestFactory.create(BackendModule);

  const configService = app.get(ConfigService);

  await app.listen(configService.get<string>('PORT'));
}

// eslint-disable-next-line @typescript-eslint/no-floating-promises
bootstrap();
