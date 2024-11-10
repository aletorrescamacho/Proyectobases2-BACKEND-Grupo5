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
      cookie: { maxAge: 3600000 }, // 1 hora de duración de la sesión
    })
  );
  await app.listen(3001);
}
bootstrap();
