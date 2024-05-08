import {
  ArgumentMetadata,
  BadRequestException,
  Injectable,
  PipeTransform,
} from '@nestjs/common';
import { ObjectSchema } from 'joi';

@Injectable()
export class JoiValidationPipe implements PipeTransform {
  constructor(private schema: ObjectSchema) {}

  transform(inputs: any, metadata: ArgumentMetadata) {
    if (metadata.type === 'custom') {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-return
      return inputs;
    }

    let rules = this.schema.extract(metadata.type);

    if (metadata.data) rules = rules.extract(metadata.data);

    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const { error, value } = rules.validate(inputs);

    if (error) {
      throw new BadRequestException(error);
    }
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return value;
  }
}
