import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
  Type,
} from '@nestjs/common';
import { map, Observable } from 'rxjs';
import { plainToClass } from 'class-transformer';

export interface MongoModelField {
  name: string;
  type?: Type<unknown>;
  nested?: MongoModelField | MongoModelField[];
}

type MongoRecord = Record<string, unknown>;

@Injectable()
export class MongoModelInterceptor implements NestInterceptor {
  public constructor(private fields: MongoModelField[]) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    return next
      .handle()
      .pipe(
        map((result: unknown) =>
          Array.isArray(result)
            ? result.map((item: unknown) => this.forSelectedFields(item))
            : this.forSelectedFields(result),
        ),
      );
  }

  private forSelectedFields(data: unknown): unknown {
    if (this.fields[0].name == '')
      return Array.isArray(data)
        ? data.map((prop: unknown) =>
            MongoModelInterceptor.process(
              prop,
              this.fields[0].type,
              this.fields[0].nested,
            ),
          )
        : MongoModelInterceptor.process(
            data,
            this.fields[0].type,
            this.fields[0].nested,
          );

    const record = data as MongoRecord;
    this.fields.forEach((item) => {
      if (record[item.name])
        record[item.name] = Array.isArray(record[item.name])
          ? (record[item.name] as unknown[]).map((prop: unknown) =>
              MongoModelInterceptor.process(prop, item.type, item.nested),
            )
          : MongoModelInterceptor.process(
              record[item.name],
              item.type,
              item.nested,
            );
    });
    return record;
  }

  public static process(
    model: unknown,
    type?: Type<unknown>,
    nested?: MongoModelField | MongoModelField[] | null,
  ): unknown {
    if (!model) return model;

    let json: unknown = null;
    try {
      json = (model as { toJSON: () => unknown }).toJSON();
    } catch {
      json = model;
    }
    let _model: unknown = type ? plainToClass(type, json) : model;

    _model = this.saveObjectId(model, _model);

    if (nested) {
      if (Array.isArray(nested)) {
        nested.forEach((obj) => this.nestedObj(_model as MongoRecord, obj));
      } else {
        this.nestedObj(_model as MongoRecord, nested);
      }
    }

    return _model;
  }

  public static nestedObj(
    model: MongoRecord,
    nested: MongoModelField,
  ): MongoRecord {
    model[nested.name] = this.process(model[nested.name], nested.type);
    return model;
  }

  public static saveObjectId(
    originalValue: unknown,
    objFromJson: unknown,
  ): unknown {
    if (!originalValue || !objFromJson) return;

    const original = originalValue as MongoRecord;
    const target = objFromJson as MongoRecord;

    Object.keys(target).forEach((prop) => {
      const value = target[prop] as { _bsontype?: string } | undefined;

      if (value?._bsontype == 'ObjectID') {
        target[prop] = original[prop];
        return;
      }

      if (typeof target[prop] == 'object') {
        target[prop] = this.saveObjectId(original[prop], target[prop]);
      }
    });

    return target;
  }
}
