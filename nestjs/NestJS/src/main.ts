import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule} from '@nestjs/swagger';
import { NestExpressApplication } from '@nestjs/platform-express';
import * as path from 'path';
import * as dotenv from 'dotenv';

async function bootstrap() {
  dotenv.config(); // dotenv ile .env dosyasını yükleyin
  // const app = await NestFactory.create(AppModule);
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  app.useStaticAssets(path.join(__dirname, '..', '..', 'Front'));
  //for Swagger
  const config = new DocumentBuilder()
    .setTitle('Nest API')
    .setDescription('the description of the API')
    .setVersion('1.0')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('/swagger', app, document);

  // app.enableCors({ origin: 'http://10.12.14.1:3000' }); // React uygulamasının IP ve portunu ekleyin
  app.enableCors({ origin: 'http://10.12.14.5:3000' }); // React uygulamasının IP ve portunu ekleyin
  await app.listen(80, '0.0.0.0');
}
bootstrap();
