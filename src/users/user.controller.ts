import { Controller, Post, Body } from '@nestjs/common';
import { Neo4jService } from '../neo4j/neo4j.service';
import { CreateUserDto } from './dto/create-user.dto';

@Controller('users')
export class UserController {
  constructor(private readonly neo4jService: Neo4jService) {}

  @Post()
  async createUser(@Body() createUserDto: CreateUserDto) {
    const { usuario_id, username, firstName, lastName, email, gender, date_of_birth, password } = createUserDto;
    return this.neo4jService.createUserNode(usuario_id, username, firstName, lastName, email, gender, date_of_birth, password);
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

