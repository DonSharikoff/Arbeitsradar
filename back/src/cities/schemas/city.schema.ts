import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

@Schema({ collection: 'cities' })
export class City {
  @Prop({ required: true })
  declare name: string;

  @Prop({ required: true })
  declare state: string;

  @Prop({ required: true })
  declare population: number;

  @Prop({ type: [String], default: [] })
  declare postalCodes: string[];

  @Prop({ required: true })
  declare lat: number;

  @Prop({ required: true })
  declare lon: number;
}

export type CityDocument = HydratedDocument<City>;
export const CitySchema = SchemaFactory.createForClass(City);
CitySchema.index({ name: 1 }, { unique: true });
