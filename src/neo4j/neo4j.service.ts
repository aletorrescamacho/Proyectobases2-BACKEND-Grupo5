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
    date_of_birth: string,
    password: string
  ) {
    const session = this.getSession();
    const query = `
      CREATE (u:User {
        usuario_id: toInteger($usuario_id),  // Forzar usuario_id a entero
        username: $username,
        firstName: $firstName,
        lastName: $lastName,
        email: $email,
        gender: $gender,
        date_of_birth: date($date_of_birth),
        password: $password
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
        date_of_birth,
        password
      });
      return result.records[0].get('u');
    } finally {
      await session.close();
    }
  }

  async listenToSong(userId: number, trackId: string) {
    const session = this.getSession();
    const query = `
      MATCH (u:User {usuario_id: $userId}), (s:Song {track_id: $trackId})
      MERGE (u)-[:ESCUCHO]->(s)
      RETURN u, s
    `;
    try {
      const result = await session.run(query, { userId, trackId });
      
      if (result.records.length > 0) {
        console.log("Relación ESCUCHO creada entre el usuario y la canción.");
        return true;
      } else {
        console.log("No se encontraron nodos de usuario o canción con los IDs especificados.");
        return false;
      }
    } catch (error) {
      console.error("Error al crear relación ESCUCHO:", error);
      throw new Error("Error al crear relación ESCUCHO");
    } finally {
      await session.close();
    }
  }
  

  async addToFavorites(userId: number, trackId: string) {
  const session = this.getSession();
  const query = `
    MATCH (u:User {usuario_id: $userId}), (s:Song {track_id: $trackId})
    MERGE (u)-[:TIENE_EN_FAVORITOS]->(s)
    RETURN u, s
  `;
  try {
    const result = await session.run(query, { userId, trackId });
    
    if (result.records.length > 0) {
      console.log("Relación TIENE_EN_FAVORITOS creada entre el usuario y la canción.");
      return true;
    } else {
      console.log("No se encontraron nodos de usuario o canción con los IDs especificados.");
      return false;
    }
  } catch (error) {
    console.error("Error al crear relación TIENE_EN_FAVORITOS:", error);
    throw new Error("Error al crear relación TIENE_EN_FAVORITOS");
  } finally {
    await session.close();
  }
}


  async followArtist(userId: number, artistId: number) {
    const session = this.getSession();
    const query = `
      MATCH (u:User {usuario_id: $userId}), (a:Artist {artist_id: $artistId})
      MERGE (u)-[:SIGUE_A]->(a)
      RETURN u, a
    `;
    try {
      const result = await session.run(query, { userId, artistId });
      return result.records.length > 0;
    } catch (error) {
      console.error("Error al crear relación SIGUE_A:", error);
      throw new Error("Error al crear relación SIGUE_A");
    } finally {
      await session.close();
    }
  }
  

}
