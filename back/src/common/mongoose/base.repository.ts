import {
  QueryFilter,
  Model,
  QueryOptions,
  ProjectionType,
  PipelineStage,
} from 'mongoose';
import { from, mergeMap, Observable, of, throwError } from 'rxjs';
import { HttpException, HttpStatus } from '@nestjs/common';

export abstract class BaseRepository {
  constructor(model: Model<any>) {
    this.model = model;
  }

  private model: Model<any>;

  public findOneOrError<T>(
    filter?: QueryFilter<T>,
    projection?: ProjectionType<T> | null,
    options?: QueryOptions<T> | null,
  ): Observable<T> {
    return from(this.model.findOne(filter, projection, options)).pipe(
      mergeMap((user) =>
        user
          ? of(user)
          : throwError(
              () =>
                new HttpException(
                  `${this.model.modelName} not found`,
                  HttpStatus.NOT_FOUND,
                ),
            ),
      ),
    ) as Observable<T>;
  }

  public aggregate<T>(
    filter: QueryFilter<T>,
    ...pipelines: PipelineStage[][]
  ): Observable<T[]> {
    let _pipelines: PipelineStage[] = [{ $match: filter }];
    pipelines.forEach((pipeline) => (_pipelines = _pipelines.concat(pipeline)));
    return from(this.model.aggregate(_pipelines).exec()) as Observable<T[]>;
  }
}
