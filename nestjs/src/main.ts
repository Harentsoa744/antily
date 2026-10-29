import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true,
  }));
  // Projet généré à usage local/prototype : CORS ouvert à tous les domaines pour que
  // n'importe quel frontend (React, Vue, Svelte, Angular...) tournant sur un autre port
  // puisse appeler l'API sans configuration supplémentaire. À restreindre en production.
  app.enableCors();
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
