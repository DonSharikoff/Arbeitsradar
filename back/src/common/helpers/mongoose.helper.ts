import {
  combineLatest,
  from,
  map,
  mergeMap,
  Observable,
  of,
  switchMap,
  throwError,
} from 'rxjs';
import {
  Document,
  Model,
  PipelineStage,
  ProjectionType,
  QueryFilter,
  QueryOptions,
  Types,
  UpdateQuery,
  UpdateWriteOpResult,
} from 'mongoose';
import { HttpException, HttpStatus } from '@nestjs/common';

type MongooseUpdateOptions<T> = NonNullable<
  Parameters<Model<T>['updateOne']>[2]
>;

export class MongooseHelper {
  public static findOneOrError<T>(
    model: Model<T>,
    filter?: QueryFilter<T>,
    projection?: ProjectionType<T> | null,
    options?: QueryOptions<T> | null,
  ): Observable<T> {
    return from(model.findOne(filter, projection, options)).pipe(
      mergeMap((user) =>
        user
          ? of(user)
          : throwError(
              () =>
                new HttpException(
                  `${model.modelName} not found`,
                  HttpStatus.NOT_FOUND,
                ),
            ),
      ),
    ) as Observable<T>;
  }

  public static findOne<T>(
    model: Model<T>,
    filter?: QueryFilter<T>,
    projection?: ProjectionType<T> | null,
    options?: QueryOptions<T> | null,
  ): Observable<T> {
    return from(model.findOne(filter, projection, options)) as Observable<T>;
  }

  public static update<T>(
    model: Model<T>,
    updatedDate: UpdateQuery<T>,
    filter?: QueryFilter<T>,
    projection?: ProjectionType<T> | null,
    options?: MongooseUpdateOptions<T> | null,
  ): Observable<number> {
    return from(
      model.updateOne(filter ?? {}, updatedDate, options ?? undefined),
    ).pipe(map((result: UpdateWriteOpResult) => result.matchedCount));
  }

  public static findAndUpdate<T>(
    model: Model<T>,
    updatedDate: UpdateQuery<T>,
    filter?: QueryFilter<T>,
    projection?: ProjectionType<T> | null,
    options?: MongooseUpdateOptions<T> | null,
  ): Observable<T[]> {
    return from(
      model.updateMany(filter ?? {}, updatedDate, options ?? undefined),
    ).pipe(
      switchMap((result: UpdateWriteOpResult) =>
        result.modifiedCount > 0
          ? (from(
              model
                .find(
                  filter,
                  projection,
                  (options ?? undefined) as QueryOptions<T> | undefined,
                )
                .exec(),
            ) as Observable<T[]>)
          : of([]),
      ),
    );
  }

  public static wrapPopulate<T>(
    doc: Document,
    populates: string[],
  ): Observable<T> {
    const arr: { path: string }[] = [];
    populates.map((str) => arr.push({ path: str }));
    return from(doc.populate(arr)) as Observable<T>;
  }

  public static wrapPopulates<T>(
    docs: Document[],
    populates: string[],
  ): Observable<T[]> {
    const arr: { path: string }[] = [];
    populates.map((str) => arr.push({ path: str }));

    const arrWithObservers: Observable<Document<T>>[] = [];

    docs.map((doc) =>
      arrWithObservers.push(from(doc.populate(arr)) as Observable<Document<T>>),
    );

    return (
      arrWithObservers.length ? combineLatest(arrWithObservers) : of([])
    ) as Observable<T[]>;
  }

  public static transformToObjectIdOrHttpError(
    val: string | Types.ObjectId,
  ): Types.ObjectId {
    try {
      return new Types.ObjectId(val);
    } catch {
      throw new HttpException(
        'Incorrect objectId value',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  public static aggregateUserProfile(
    filter: QueryFilter<any>,
  ): PipelineStage[] {
    return [
      { $match: filter },
      {
        $lookup: {
          from: 'users',
          localField: 'userId',
          foreignField: '_id',
          as: 'profile',
        },
      },
      { $unwind: { path: '$profile' } },
    ];
  }
}
