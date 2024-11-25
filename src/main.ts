import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as session from 'express-session';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  app.enableCors({
    origin: ['http://localhost:3000', 'https://proyectobases2-backend-grupo5-production.up.railway.app', 'https://proyectobases2-frontend-grupo5-momgq5w95.vercel.app/','https://proyectobases2-frontend-grupo5.vercel.app/'], // Agrega aquí el dominio de tu frontend
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: false // Habilita las cookies si estás usando sesiones
  });
  await app.listen(3001);
}
bootstrap();

