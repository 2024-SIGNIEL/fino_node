import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { CorsOptions } from './utils/cors.option';
import { WinstonInstance } from './utils/winston.logger';
import { WinstonModule } from 'nest-winston';
import { Logger, ValidationPipe } from '@nestjs/common';
import { HttpExceptionFilter } from './utils/httpException.filter';
import { configDotenv } from 'dotenv';

async function bootstrap() {
  configDotenv({
    path: '../.env'
  });
  const logger = new Logger();

  const app = await NestFactory.create(AppModule, {
    cors: CorsOptions,
    logger: WinstonModule.createLogger({
      instance: WinstonInstance,
    }),
  });

  app.useGlobalFilters(new HttpExceptionFilter(logger));
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      forbidNonWhitelisted: true,
      disableErrorMessages: process.env.NODE_ENV === ("prod" || "dev"),
    }),
  );

  const port: number = Number(process.env.PORT ?? 8080);

  await app.listen(port, () => {
    logger.log(`Application started in port ${port}`)
  });
}
bootstrap();
