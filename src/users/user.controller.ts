import { Controller, Post, Body, Request } from '@nestjs/common';
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
  async listenToSong(@Body() body: { userId: number, trackId: string }) {
    const { userId, trackId } = body;
    return this.neo4jService.listenToSong(userId, trackId);
  }

  // Relación TIENE_EN_FAVORITOS entre Usuario y Canción
  @Post('add-to-favorites')
  async addToFavorites(@Body() body: { userId: number, trackId: string }) {
    const { userId, trackId } = body;
    return this.neo4jService.addToFavorites(userId, trackId);
  }

  // Relación SIGUE_A entre Usuario y Artista
  @Post('follow-artist')
  async followArtist(@Body() body: { userId: number, artistId: number }) {
    const { userId, artistId } = body;
    return this.neo4jService.followArtist(userId, artistId);
  }

  

}

