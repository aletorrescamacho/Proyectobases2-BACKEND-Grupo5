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
        httpOnly: false,
        secure: false, 
        sameSite: 'None'
      }
    })
  );
  app.enableCors({
    origin: 'http://localhost:3000', // Agrega aquí el dominio de tu frontend
    methods: ['GET','HEAD','PUT','PATCH','POST','DELETE'],
    credentials: true // Habilita las cookies si estás usando sesiones
  });
  await app.listen(3001);
}
bootstrap();

