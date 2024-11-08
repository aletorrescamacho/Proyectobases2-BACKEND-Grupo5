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

  //user escucha cancion
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
  
  //user pone cancion en fav
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

  //usuario sigue a cantante
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

  ////////METODOS////////////DE///////////////RECOMENDACIONES///////////////////////////////////////

  //encuentra canciones del genero que mas veces se repite (Top1) basado en CANCIONES FAV LISTO
  async recommendByGenre(userId: number) {
    const session = this.getSession();
    const query = `
      MATCH (u:User {usuario_id: $userId})-[:TIENE_EN_FAVORITOS]->(s:Song)-[:PERTENECE_A]->(g:Genre)
      WITH u, g, count(s) as songCount
      ORDER BY songCount DESC LIMIT 1
      MATCH (s:Song)-[:PERTENECE_A]->(g)
      WHERE NOT (u)-[:TIENE_EN_FAVORITOS]->(s)
      WITH DISTINCT s.track_name AS trackName, s
      RETURN s
      LIMIT 10

    `;
    const result = await session.run(query, { userId: Number(userId) });
    await session.close();
    return result.records.map(record => record.get('s').properties);
  } 
  

  
  // Encuentra canciones del SEGUNDO genero que mas veces se repite en fav basado en CANCIONES FAV
  async recommendBySecondGenre(userId: number) {
    const session = this.getSession();
    const query = `
      MATCH (u:User {usuario_id: $userId})-[:TIENE_EN_FAVORITOS]->(s:Song)-[:PERTENECE_A]->(g:Genre)
      WITH u, g, count(s) as songCount
      ORDER BY songCount DESC SKIP 1 LIMIT 1
      MATCH (s:Song)-[:PERTENECE_A]->(g) 
      WHERE NOT (u)-[:TIENE_EN_FAVORITOS]->(s)
      WITH DISTINCT s.track_name AS trackName, s
      RETURN s
      LIMIT 10
    `;
    const result = await session.run(query, { userId: Number(userId)});
    await session.close();
    return result.records.map(record => record.get('s').properties);
  }

  // RECOMIENDA CANCIONES (QUE NO ESTAN EN FAV) DE UN ARTISTA DEL CUAL SE HAN ESCUCHADO MAS CANCIONES (TOP1) LISTO
  async recommendByArtist(userId: number) {
    const session = this.getSession();
    console.log('Session established:', session);

    const query = `
      MATCH (u:User {usuario_id : $userId})-[:ESCUCHO]->(s:Song)-[:CANTADA_POR]->(a:Artist)
      WITH u, a, count(s) as songCount
      ORDER BY songCount DESC LIMIT 1
      MATCH (a)<-[:CANTADA_POR]-(s:Song)
      WHERE NOT (u)-[:TIENE_EN_FAVORITOS]->(s)
      RETURN s
      LIMIT 10
    `;
    try {
      console.log('Executing query:', query);
      const result = await session.run(query, { userId: Number(userId) });
      console.log('Query results:', result.records);  // Log para ver el contenido de los registros
  
      // Verificar si hay resultados antes de mapear
      if (result.records.length === 0) {
        console.log('No recommendations found.');
        return [];  // Retornar un array vacío si no hay resultados
      }
  
      // Si hay resultados, mapear y retornar las propiedades de las canciones
      return result.records.map(record => record.get('s').properties);
    } catch (error) {
      throw new Error('Error fetching artist recommendations. Please try again later.');
    } finally {
      await session.close();
    }
  }

  
  // Recomendación de otras canciones del mismo artista LISTO
  async recommendArtists(userId: number) {
    const session = this.getSession();
    const query = `
      MATCH (u:User {usuario_id: $userId})-[:ESCUCHO]->(s:Song)-[:CANTADA_POR]->(a:Artist)
      WITH a, count(s) as playCount, u
      ORDER BY playCount DESC
      LIMIT 10  // Selecciona los 10 artistas más reproducidos
      WHERE NOT (u)-[:SIGUE_A]->(a)  // Filtra para que el usuario aún no siga a estos artistas
      RETURN a
    `;
    const result = await session.run(query, { userId: Number(userId)});
    await session.close();
    return result.records.map(record => record.get('a').properties);
  }
  

}
