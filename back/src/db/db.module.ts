import { Global, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigService } from '@nestjs/config';

@Global()
@Module({
    imports: [
        MongooseModule.forRootAsync({
            inject: [ConfigService],
            useFactory: (configService: ConfigService) => ({
                uri: `mongodb://${configService.get<string>('DATABASE_HOST')}/`,
                user: configService.get<string>('DATABASE_USER'),
                pass: configService.get<string>('DATABASE_PASSWORD'),
                dbName: configService.get<string>('DATABASE_NAME'),
            }),
        }),
    ],
})
export class DbModule {}
