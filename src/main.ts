import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as session from 'express-session';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Configuración temporal de CORS
  app.enableCors({
    origin: 'https://proyectobases2-backend-grupo5-production.up.railway.app/', // Coloca aquí tu URL en Railway
    credentials: true, // Permite el uso de cookies
  });

  // Configuración de sesiones
  app.use(
    session({
      secret: 'your-secret-key',
      resave: false,
      saveUninitialized: false,
      cookie: {
        maxAge: 3600000,
        secure: true, // Asegúrate de que sea `true` si estás usando HTTPS en Railway
        sameSite: 'none' // Necesario para permitir cookies de sesión en CORS
      },
    }),
  );

  await app.listen(3001);
}
bootstrap();

