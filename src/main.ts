import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as session from 'express-session';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(
    session({
      secret: 'my_secret_key', // Usa cualquier cadena para esta clave
      resave: false,
      saveUninitialized: false,
      cookie: {
        maxAge: 3600000, // 1 hora en milisegundos
        httpOnly: true,
        secure: true, // Solo en producción
        sameSite: 'None' // Esto permite las cookies entre diferentes orígenes
      }
    })
  );
  app.enableCors({
    origin: ['http://localhost:3000', 'https://proyectobases2-backend-grupo5-production.up.railway.app/'], // Agrega aquí el dominio de tu frontend
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true // Habilita las cookies si estás usando sesiones
  });
  await app.listen(3001);
}
bootstrap();

