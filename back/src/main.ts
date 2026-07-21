import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { AppModule } from './app.module';
import helmet from 'helmet';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  const port = configService.get<number>('START_PORT') || 3000;
  const isProduction = configService.get<string>('NODE_ENV') === 'production';

  app.enableShutdownHooks();
  app.use(helmet());

  if (!isProduction) {
    const config = new DocumentBuilder()
      .setTitle('Arbeitsradar')
      .setVersion('1.0')
      .build();

    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api/docs', app, document);
  }

  await app.listen(port);
  Logger.log(`Server listening on port ${port}`, 'Bootstrap');
}
bootstrap();
