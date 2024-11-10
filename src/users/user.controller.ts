import { Controller, Post, Body, Request, UnauthorizedException } from '@nestjs/common';
import { Neo4jService } from '../neo4j/neo4j.service';
import { CreateUserDto } from './dto/create-user.dto';

@Controller('users')
export class UserController {
  constructor(private readonly neo4jService: Neo4jService) {}

  @Post('register')
  async createUser(@Body() createUserDto: CreateUserDto, @Request() req) {
    const { usuario_id, username, firstName, lastName, email, gender, date_of_birth, password } = createUserDto;
    return this.neo4jService.createUserNode(
      usuario_id,
      username,
      firstName,
      lastName,
      email,
      gender,
      date_of_birth,
      password,
      req // Pasa req para guardar la sesión
    );
  }

  // Relación ESCUCHO entre Usuario y Canción
  @Post('listen-to-song')
  async listenToSong(@Request() req, @Body('trackId') trackId: string) {
    const userId = req.session.userId; // Obtiene el userId de la sesión
    if (!userId) {
      throw new UnauthorizedException('User not logged in');
    }
    return this.neo4jService.listenToSong(userId, trackId);
  }

  // Relación TIENE_EN_FAVORITOS entre Usuario y Canción
  @Post('add-to-favorites')
  async addToFavorites(@Request() req, @Body('trackId') trackId: string) {
    console.log(req.session.userId)
    const userId = req.session.userId; // Obtiene el userId de la sesión
    if (!userId) {
      throw new UnauthorizedException('User not logged in');
    }
    return this.neo4jService.addToFavorites(userId, trackId);
  }

  // Relación SIGUE_A entre Usuario y Artista
  @Post('follow-artist')
  async followArtist(@Request() req, @Body('artistId') artistId: number) {
    const userId = req.session.userId; // Obtiene el userId de la sesión
    if (!userId) {
      throw new UnauthorizedException('User not logged in');
    }
    return this.neo4jService.followArtist(userId, artistId);
  }

  //LOGIN
  @Post('login')
  async login(
    @Body('email') email: string,
    @Body('password') password: string,
    @Request() req
  ) {
    return await this.neo4jService.authenticateUser(email, password, req);
  }
}

