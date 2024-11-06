import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { Neo4jModule } from './neo4j/neo4j.module';
import { Neo4jService } from './neo4j/neo4j.service';
import { UserController } from './users/user.controller'; 
import { RecommenderController } from './recommender/recommender.controller';

@Module({
  imports: [Neo4jModule],
  controllers: [AppController, UserController, RecommenderController],
  providers: [AppService, Neo4jService],
})
export class AppModule {}

