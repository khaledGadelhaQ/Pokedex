import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestExpressApplication } from '@nestjs/platform-express';
import { HttpAdapterHost } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { join } from 'path';
import { existsSync } from 'fs';
import { AppModule } from './app.module';
import { CatchEverythingFilter } from './common/filters/catch-everything.filter';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  // Get ConfigService
  const configService = app.get(ConfigService);
  const port = configService.get<number>('port', 3000);
  const corsOrigin = configService.get<string>('cors.origin', '*');
  const nodeEnv = configService.get<string>('nodeEnv', 'development');

  // Register global exception filter
  const httpAdapterHost = app.get(HttpAdapterHost);
  app.useGlobalFilters(new CatchEverythingFilter(httpAdapterHost));

  // Setup Swagger/OpenAPI documentation
  const config = new DocumentBuilder()
    .setTitle('Pokedex API')
    .setDescription('API for managing Pokemon and Teams')
    .setVersion('1.0.0')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'Token',
        description: 'Enter your bearer token (pokedex-secret-token-2024)',
      },
      'bearer',
    )
    .addServer(`http://localhost:${port}/api/v1`, 'Development')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  // Serve uploaded images statically
  // In development: dist/uploads, in production: uploads from project root
  const uploadsPath = join(process.cwd(), 'uploads');

  if (existsSync(uploadsPath)) {
    app.useStaticAssets(uploadsPath, {
      prefix: '/images/',
    });
    console.log(`📁 Serving static files from: ${uploadsPath}`);
  } else {
    console.warn(`⚠️  Uploads directory not found at: ${uploadsPath}`);
  }

  // Enable CORS for frontend communication
  // This only helpes in production mode
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
  console.log(`� API Documentation: http://localhost:${port}/api/docs`);
  console.log(`�🔧 Environment: ${nodeEnv}`);
}

void bootstrap();
