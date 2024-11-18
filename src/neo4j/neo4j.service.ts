import { Injectable, Inject, UnauthorizedException } from '@nestjs/common';
import { Driver, Session } from 'neo4j-driver';
import { CreateUserDto } from 'src/users/dto/create-user.dto';


@Injectable()
export class Neo4jService {
  constructor(@Inject('NEO4J_DRIVER') private readonly driver: Driver) {}

  private getSession(): Session {
    return this.driver.session();
  }

  // Método actualizado para crear un usuario con la estructura completa
  async createUserNode(createUserDto: CreateUserDto) {
    const { username, firstName, lastName, email, gender, date_of_birth, password } = createUserDto;
    const usuario_id = Math.floor(100000000 + Math.random() * 900000000);
   

    const session = this.getSession()
    try {
      const result = await session.run(
        `
        CREATE (u:User {
          usuario_id: toInteger($usuario_id),
          username: $username,
          firstName: $firstName,
          lastName: $lastName,
          email: $email,
          gender: $gender,
          date_of_birth: $date_of_birth,
          password: $password
        })
        RETURN u
        `,
        {
          usuario_id,
          username,
          firstName,
          lastName,
          email,
          gender,
          date_of_birth,
          password
        }
      );

      return result.records[0].get('u').properties;
    } finally {
      await session.close();
    }
  }

  //usuario escucha cancion, ya funciona con la sesion del usuario
  async listenToSong(userId: number, trackId: string) {
    const session = this.getSession();
    console.log(userId,trackId)
    const query = `
      MATCH (u:User {usuario_id: toInteger($userId)})
      WITH u
      MATCH (s:Song {track_id: $trackId})
      MERGE (u)-[:ESCUCHO]->(s)
      RETURN u, s

    `;

    const checkUser = await session.run(`MATCH (u:User {usuario_id: $userId}) RETURN u`, { userId });
    const checkSong = await session.run(`MATCH (s:Song {track_id: $trackId}) RETURN s`, { trackId });

    try {
      const result = await session.run(query, { userId, trackId });
      if (checkUser.records.length === 0) {
        console.error("No se encontró el usuario con el ID especificado.");
      }
      if (checkSong.records.length === 0) {
        console.error("No se encontró la canción con el ID especificado.");
      }

      if (result.records.length > 0) {
        console.log("Relación ESCUCHO creada entre el usuario y la canción.");
        return { message: 'Relación ESCUCHO creada', success: true };
      } else {
        console.log("No se encontraron nodos de usuario o canción con los IDs especificados.");
        return { message: 'Usuario o canción no encontrados', success: false };
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
    MATCH (u:User {usuario_id: toInteger($userId)}), (s:Song {track_id: $trackId})
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

  //usuario quita cancion de favoritos
  async quitFromFav(userId: number, trackId: string) {
    const session = this.getSession();
    const query = `
    MATCH (u:User {usuario_id: toInteger($userId)})-[r:TIENE_EN_FAVORITOS]->(s:Song {track_id: $trackId})
    DELETE r
  `;
    
  try {
    const result = await session.run(query, { userId, trackId });
    
    if (result.records.length > 0) {
      console.log("Relación TIENE_EN_FAVORITOS DESTRUIDA entre el usuario y la canción.");
      return true;
    } else {
      console.log("No se encontraron nodos de usuario o canción con los IDs especificados.");
      return false;
    }
  } catch (error) {
    console.error("Error al DESTRUIR relación TIENE_EN_FAVORITOS:", error);
    throw new Error("Error al DESTRUIR relación TIENE_EN_FAVORITOS");
  } finally {
    await session.close();
  }

  }

  //usuario sigue a cantante
  async followArtist(userId: number, artistId: number) {
    const session = this.getSession();
    const query = `
      MATCH (u:User {usuario_id: toInteger($userId)}), (a:Artist {artist_id: toInteger($artistId)})
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

  //usuario deja de seguir a cantante
  async stopFollowingArtist(userId: number, artistId: number) {
    const session = this.getSession();
    const query = `
      MATCH (u:User {usuario_id: toInteger($userId)})-[r:SIGUE_A]->(a:Artist {artist_id: toInteger($artistId)})
      DELETE r
    `;
    try {
      const result = await session.run(query, { userId, artistId });
      return result.records.length > 0;
    } catch (error) {
      console.error("Error al DESTRUIR relación SIGUE_A:", error);
      throw new Error("Error al DESTRUIR relación SIGUE_A");
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

    const checkUser = await session.run(`MATCH (u:User {usuario_id: $userId}) RETURN u`, { userId });

    const result = await session.run(query, { userId: Number(userId) });
    if (checkUser.records.length === 0) {
      console.error("No se encontró el usuario con el ID especificado en recomendacion.");
    }
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

  
  // Recomendación de aritstas por las canciones mas escuchadas LISTO
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
  
///////////////////////////////////////////VErificar inicio de sesion del usuario////////////////////////////////////////////////

  async verifyUser(email: string, password: string) {
    const session = this.getSession();
    try {
      const result = await session.run(
        `
        MATCH (u:User { email: $email, password: $password })
        RETURN u
        `,
        { email, password }
      );

      if (result.records.length === 0) {
        return null; // Usuario no encontrado o credenciales incorrectas
      }

      // Retorna los datos del usuario
      const user = result.records[0].get('u').properties;
      return user;
    } finally {
      await session.close();
    }
  }

/////////////////////////////////////////////////////////Metodos para encontrar canciones y artistas//////////////////////////////////

async findSongByName(songName: string) {
  const session = this.getSession();
  const query = `
    MATCH (s:Song)-[:CANTADA_POR]->(a:Artist), (s)-[:PERTENECE_A]->(g:Genre)
    WHERE toLower(s.track_name) CONTAINS toLower($songName)
    RETURN s.track_id AS trackId, s.track_name AS trackName, 
           a.artist_id AS artistId, a.artists AS artistName, 
           g.genre_id AS genreId, g.track_genre AS genreName
  `;
  try {
    const result = await session.run(query, { songName });
    return result.records.map(record => ({
      trackId: record.get('trackId'),
      trackName: record.get('trackName'),
      artistId: record.get('artistId'),
      artistName: record.get('artistName'),
      genreId: record.get('genreId'),
      genreName: record.get('genreName')
    }));
  } finally {
    await session.close();
  }
}


  // Método para buscar un artista por nombre
  async findArtistByName(artistName: string) {
    const session = this.getSession();
    const query = `
      MATCH (a:Artist)
      WHERE toLower(a.artists) CONTAINS toLower($artistName)
      RETURN a
    `;
    try {
      const result = await session.run(query, { artistName });
      return result.records.map(record => record.get('a').properties);
    } finally {
      await session.close();
    }
  }
  


  // Revisa que la cancion este en favoritos o no
async checkFavorite(userId: string, trackName: string) {
  const session = this.getSession();
  const query = `
    MATCH (u:User {usuario_id: $userId})-[:TIENE_EN_FAVORITOS]->(s:Song {track_name: $trackName})
    RETURN COUNT(s) > 0 AS isFavorite
  `;
  try {
    const result = await session.run(query, { userId: parseInt(userId), trackName });
    return result.records[0].get("isFavorite");
  } finally {
    await session.close();
  }
}
   
//Revisa que el artista se siga o no
async checkFollow(userId: string, artistId: number) {
  console.log(artistId);
  const session = this.getSession();
  const query = `
    MATCH (u:User {usuario_id: $userId})-[:SIGUE_A]->(a:Artist {artist_id: toInteger($artistId)})
    RETURN COUNT(a) > 0 AS isFavorite
  `;
  try {
    const result = await session.run(query, { userId: parseInt(userId), artistId });
    return result.records[0].get("isFavorite");
  } finally {
    await session.close();
  }
}





}
