import * as Joi from 'joi';

import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { HelloWorldController } from './hello-world.controller';
import { HelloWorldService } from './hello-world.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      validationSchema: Joi.object({
        NODE_ENV: Joi.string()
          .valid('development', 'production', 'test')
          .default('development'),
        PORT: Joi.number().empty('').default(3000),
        DATABASE_URL: Joi.alternatives([
          Joi.string().ip({ cidr: 'forbidden' }),
          Joi.string().hostname(),
        ])
          .empty('')
          .default('localhost'),
        DATABASE_PORT: Joi.number().empty('').default(3306),
        DATABASE_USER: Joi.string().required(),
        DATABASE_PASS: Joi.string().required(),
        DATABASE_NAME: Joi.string().required(),
        DATABASE_PREFIX: Joi.string().empty('').default('bs_'),
        REDIS_HOST: Joi.alternatives([
          Joi.string().ip({ cidr: 'forbidden' }),
          Joi.string().hostname(),
        ])
          .empty('')
          .default('localhost'),
        REDIS_PORT: Joi.number().empty('').default(6379),
      }),
    }),
  ],
  controllers: [HelloWorldController],
  providers: [HelloWorldService],
})
export class HelloWorldModule {}
