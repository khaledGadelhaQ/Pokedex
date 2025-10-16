import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Get ConfigService
  const configService = app.get(ConfigService);
  const port = configService.get<number>('port', 3000);
  const corsOrigin = configService.get<string>('cors.origin', '*');
  const nodeEnv = configService.get<string>('nodeEnv', 'development');

  // Enable CORS for frontend communication
  app.enableCors({
    origin: corsOrigin,
    credentials: true,
  });

  // Set global API prefix according to OpenAPI spec
  app.setGlobalPrefix('api/v1');

  // Enable validation pipes for DTOs
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  await app.listen(port);

  console.log(`🚀 Application is running on: http://localhost:${port}/api/v1`);
  console.log(`🔧 Environment: ${nodeEnv}`);
}

void bootstrap();
