import {
  ClassSerializerInterceptor,
  PlainLiteralObject,
  Type,
} from '@nestjs/common';
import { ClassTransformOptions, plainToClass } from 'class-transformer';
import { Document } from 'mongoose';

function MongooseClassSerializerInterceptor<T>(
  classToIntercept: Type<T>,
): typeof ClassSerializerInterceptor {
  return class Interceptor extends ClassSerializerInterceptor {
    private changePlainObjectToClass(
      document: PlainLiteralObject,
    ): PlainLiteralObject | T {
      if (!(document instanceof Document)) {
        return document;
      }
      return plainToClass(classToIntercept, document.toJSON());
    }

    private prepareResponse(
      response: PlainLiteralObject | PlainLiteralObject[],
    ): (PlainLiteralObject | T) | (PlainLiteralObject | T)[] {
      if (Array.isArray(response)) {
        return response.map((document) =>
          this.changePlainObjectToClass(document),
        );
      }

      return this.changePlainObjectToClass(response);
    }

    serialize(
      response: PlainLiteralObject | PlainLiteralObject[],
      options: ClassTransformOptions,
    ): PlainLiteralObject | PlainLiteralObject[] {
      return super.serialize(
        this.prepareResponse(response) as
          PlainLiteralObject | PlainLiteralObject[],
        options,
      );
    }
  };
}

export default MongooseClassSerializerInterceptor;
