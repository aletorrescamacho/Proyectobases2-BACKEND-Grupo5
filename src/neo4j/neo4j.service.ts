import { Injectable, Inject } from '@nestjs/common';
import { Driver, Session } from 'neo4j-driver';

@Injectable()
export class Neo4jService {
  constructor(@Inject('NEO4J_DRIVER') private readonly driver: Driver) {}

  private getSession(): Session {
    return this.driver.session();
  }

  // Método para crear un usuario en la base de datos
  async createUserNode(username: string, age: number, email: string) {
    const session = this.getSession();
    const query = `
      CREATE (u:User {username: $username, age: $age, email: $email})
      RETURN u
    `;
    try {
      const result = await session.run(query, { username, age, email });
      return result.records[0].get('u');
    } finally {
      await session.close();
    }
  }

  // Método para obtener todas las canciones de Neo4j
  async getAllSongs() {
    const session = this.getSession();
    const query = `MATCH (s:Song) RETURN s`;
    try {
      const result = await session.run(query);
      return result.records.map(record => record.get('s').properties);
    } finally {
      await session.close();
    }
  }
}
