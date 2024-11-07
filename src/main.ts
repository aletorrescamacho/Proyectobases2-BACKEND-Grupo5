import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Configuración temporal de CORS
  app.enableCors(); // Permite cualquier origen temporalmente

  await app.listen(3001);
}
bootstrap();
