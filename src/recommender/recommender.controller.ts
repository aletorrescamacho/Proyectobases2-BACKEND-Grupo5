import { Controller, Get, Param, UnauthorizedException, Request } from '@nestjs/common';
import { Neo4jService } from '../neo4j/neo4j.service';

@Controller('recommender')
export class RecommenderController {
  constructor(private readonly neo4jService: Neo4jService) {}

  
  @Get('recommend-by-genre')
  async recommendByGenre(@Request() req) {
    const userId = req.session.userId; // Obtiene el userId de la sesión
    if (!userId) {
      throw new UnauthorizedException('User not logged in');
    }
    return await this.neo4jService.recommendByGenre(userId);
  }

  @Get('recommend-by-second-genre')
  async recommendBySecondGenre(@Request() req) {
    const userId = req.session.userId; // Obtiene el userId de la sesión
    if (!userId) {
      throw new UnauthorizedException('User not logged in');
    }
    return await this.neo4jService.recommendBySecondGenre(userId);
  }

  @Get('recommend-by-artist')
  async recommendByArtist(@Request() req) {
    const userId = req.session.userId; // Obtiene el userId de la sesión
    if (!userId) {
      throw new UnauthorizedException('User not logged in');
    }
    return await this.neo4jService.recommendByArtist(userId);
  }

  @Get('recommend-artists-by-songs')
  async recommendArtists(@Request() req) {
    const userId = req.session.userId; // Obtiene el userId de la sesión
    if (!userId) {
      throw new UnauthorizedException('User not logged in');
    }
    return await this.neo4jService.recommendArtists(userId);
  }
}
