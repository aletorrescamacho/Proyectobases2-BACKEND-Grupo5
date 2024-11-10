import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as session from 'express-session';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Configuración temporal de CORS
  app.enableCors(); // Permite cualquier origen temporalmente

  // Configuración de sesiones
  app.use(
    session({
      secret: 'your-secret-key', // Cambia esta clave a una segura para producción
      resave: false,
      saveUninitialized: false,
      cookie: { maxAge: 3600000 }, // 1 hora de duración para la sesión
    }),
  );

  await app.listen(3001);
}
bootstrap();

