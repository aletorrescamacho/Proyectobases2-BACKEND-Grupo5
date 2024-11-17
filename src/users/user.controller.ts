import { Controller, Post, Body, Request, UnauthorizedException } from '@nestjs/common';
import { Neo4jService } from '../neo4j/neo4j.service';
import { CreateUserDto } from './dto/create-user.dto';

@Controller('users')
export class UserController {
  constructor(private readonly neo4jService: Neo4jService) {}
  

  @Post('register')
  async createUser(@Body() createUserDto: CreateUserDto) {
    
    const newUser = await this.neo4jService.createUserNode(createUserDto);
    
    
    return { message: 'Usuario registrado exitosamente', user: {userId: newUser.usuario_id, username: newUser.username} };
  }

  // Relación ESCUCHO entre Usuario y Canción
  @Post('listen-to-song')
  async listenToSong(@Body() body: { trackId: string, userId: number }) {
    // Verifica que el userId esté presente
    if (!body.userId) {
      throw new UnauthorizedException('Usuario no autenticado');
    }
  
    const userId = body.userId;
    const trackId = body.trackId;

    console.log("Tipo de userId listentosong:", typeof userId);
  
    return this.neo4jService.listenToSong(userId, trackId);
  }
  


  // Relación TIENE_EN_FAVORITOS entre Usuario y Canción MODIFICADO PARA QUE MANTENGA LA SESION
  @Post('add-to-favorites')
  async addToFavorites(@Body() body: { trackId: string, userId: number }) {
    
    // Verifica que el userId esté presente
    if (!body.userId) {
      throw new UnauthorizedException('Usuario no autenticado');
    }

    // Obtiene el userId desde la sesión activa
    const userId = body.userId;
    const trackId = body.trackId;

    return this.neo4jService.addToFavorites(userId, trackId);
  }

  // DESTRUYE Relación TIENE_EN_FAVORITOS entre Usuario y Canción 
  @Post('quit-from-favorites')
  async quitFromFav(@Body() body: { trackId: string, userId: number }) {
    
    // Verifica que el userId esté presente
    if (!body.userId) {
      throw new UnauthorizedException('Usuario no autenticado');
    }

    // Obtiene el userId desde la sesión activa
    const userId = body.userId;
    const trackId = body.trackId;

    return this.neo4jService.quitFromFav(userId, trackId);
  }


  // Relación SIGUE_A entre Usuario y Artista ACTUALIZADO MANTIENE SESION ACTIVA
  @Post('follow-artist')
  async followArtist(@Body() body: { artistId: number, userId: number }) {
    
     // Verifica que el userId esté presente
     if (!body.userId) {
      throw new UnauthorizedException('Usuario no autenticado');
    }

    // Obtiene el userId desde la sesión activa
    const userId = body.userId;
    const artistId = body.artistId;

    return this.neo4jService.followArtist(userId, artistId);
  }

  //DESTRUYE relacion de SIGUE_A entre usuario y artista 
  @Post('stop-following-artist')
  async stopFollowingArtist(@Body() body: { artistId: number, userId: number }) {
    
     // Verifica que el userId esté presente
     if (!body.userId) {
      throw new UnauthorizedException('Usuario no autenticado');
    }

    // Obtiene el userId desde la sesión activa
    const userId = body.userId;
    const artistId = body.artistId;

    return this.neo4jService.stopFollowingArtist(userId, artistId);
  }
  
  @Post('login')
async loginUser(
  @Body() loginUserDto: { email: string, password: string },
) {
  const { email, password } = loginUserDto;

  // Verifica el usuario en la base de datos
  const user = await this.neo4jService.verifyUser(email, password);
  if (!user) {
    throw new UnauthorizedException('Credenciales inválidas');
  }

  // En lugar de guardar el usuario en la sesión, lo devolvemos en la respuesta
  return { 
    message: 'Inicio de sesión exitoso', 
    user: { userId: user.usuario_id, username: user.username } 
  };
}
  

}

