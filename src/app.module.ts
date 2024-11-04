import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';

import { Neo4jModule } from './neo4j/neo4j.module';
import { Neo4jService } from './neo4j/neo4j.service';

@Module({
  imports: [Neo4jModule],
  controllers: [AppController],
  providers: [AppService, Neo4jService],
})
export class AppModule {}
