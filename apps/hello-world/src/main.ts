import { NestFactory } from '@nestjs/core';
import { HelloWorldModule } from './hello-world.module';

async function bootstrap() {
  const app = await NestFactory.create(HelloWorldModule);
  await app.listen(3000);
}

// eslint-disable-next-line @typescript-eslint/no-floating-promises
bootstrap();
