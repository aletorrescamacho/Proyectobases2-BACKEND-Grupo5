import { Injectable, Inject } from '@nestjs/common';
import { Driver, Session } from 'neo4j-driver';

@Injectable()
export class Neo4jService {
  constructor(@Inject('NEO4J_DRIVER') private readonly driver: Driver) {}

  private getSession(): Session {
    return this.driver.session();
  }

  // Método actualizado para crear un usuario con la estructura completa
  async createUserNode(
    usuario_id: number,
    username: string,
    firstName: string,
    lastName: string,
    email: string,
    gender: string,
    date_of_birth: Date
  ) {
    const session = this.getSession();
    const query = `
      CREATE (u:User {
        usuario_id: $usuario_id,
        username: $username,
        firstName: $firstName,
        lastName: $lastName,
        email: $email,
        gender: $gender,
        date_of_birth: datetime($date_of_birth)
      })
      RETURN u
    `;
    try {
      const result = await session.run(query, {
        usuario_id,
        username,
        firstName,
        lastName,
        email,
        gender,
        date_of_birth: date_of_birth.toISOString() // Convertimos a formato ISO para Neo4j
      });
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
