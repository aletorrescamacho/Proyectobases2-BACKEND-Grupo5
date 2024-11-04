import { Module, Global } from '@nestjs/common';
import neo4j, { Driver } from 'neo4j-driver';

@Global()
@Module({
  providers: [
    {
      provide: 'NEO4J_DRIVER',
      useFactory: (): Driver => {
        const driver = neo4j.driver(
          'neo4j+s://a4ac6e62.databases.neo4j.io', 
          neo4j.auth.basic('neo4j', 'oRAQxIQNJchAA5zmamQHs-r1ji6y4_BB0Xv3AgT8QTw') 
        );
        return driver;
      },
    },
  ],
  exports: ['NEO4J_DRIVER'],
})
export class Neo4jModule {}
