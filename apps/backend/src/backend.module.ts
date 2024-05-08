import * as Joi from 'joi';

import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Contact } from './contact/contact.entity';
import { ContactModule } from './contact/contact.module';

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
      }),
    }),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.DATABASE_URL,
      port: Number(process.env.DATABASE_PORT),
      username: process.env.DATABASE_USER,
      password: process.env.DATABASE_PASS,
      database: process.env.DATABASE_NAME,
      entities: [Contact],
      entityPrefix: process.env.DATABASE_PREFIX,
      synchronize: true,
      logging: true,
    }),
    ContactModule,
  ],
})
export class BackendModule {}
