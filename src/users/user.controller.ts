import { Controller, Post, Body, Request, UnauthorizedException } from '@nestjs/common';
import { Neo4jService } from '../neo4j/neo4j.service';
import { CreateUserDto } from './dto/create-user.dto';

@Controller('users')
export class UserController {
  constructor(private readonly neo4jService: Neo4jService) {}
  

  @Post('register')
  async createUser(@Body() createUserDto: CreateUserDto, @Request() req) {
    const newUser = await this.neo4jService.createUserNode(createUserDto);
    
    // Guardar el usuario en la sesión para que esté registrado
    req.session.user = { userId: newUser.usuario_id, username: newUser.username };
    
    return { message: 'Usuario registrado exitosamente', user: req.session.user };
  }

  // Relación ESCUCHO entre Usuario y Canción
    @Post('listen-to-song')
  async listenToSong(@Body() body: { trackId: string }, @Request() req) {
    // Verifica que el usuario esté autenticado
    if (!req.session.user) {
      throw new UnauthorizedException('Usuario no autenticado');
    }

    const userId = req.session.user.userId;
    const trackId = body.trackId;

    return this.neo4jService.listenToSong(userId, trackId);
  }


  // Relación TIENE_EN_FAVORITOS entre Usuario y Canción
  @Post('add-to-favorites')
  async addToFavorites(@Body() body: { trackId: string }, @Request() req) {
    // Verifica que el usuario esté autenticado
    if (!req.session.user) {
      throw new UnauthorizedException('Usuario no autenticado');
    }

    // Obtiene el userId desde la sesión activa
    const userId = req.session.user.userId;
    const trackId = body.trackId;

    return this.neo4jService.addToFavorites(userId, trackId);
  }



  // Relación SIGUE_A entre Usuario y Artista
  @Post('follow-artist')
  async followArtist(@Body() body: { userId: number, artistId: number }) {
    const { userId, artistId } = body;
    return this.neo4jService.followArtist(userId, artistId);
  }

  @Post('login')
  async loginUser(
    @Body() loginUserDto: { email: string, password: string },
    @Request() req
  ) {
    const { email, password } = loginUserDto;

    // Verifica el usuario en la base de datos
    const user = await this.neo4jService.verifyUser(email, password);
    if (!user) {
      throw new UnauthorizedException('Credenciales inválidas');
    }

    // Guarda el usuario en la sesión
    req.session.user = { userId: user.usuario_id, username: user.username };
    
    return { message: 'Inicio de sesión exitoso', user: req.session.user };
  }
  

}

