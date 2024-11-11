import { Controller, Get, Param, Request, UnauthorizedException } from '@nestjs/common';
import { Neo4jService } from '../neo4j/neo4j.service';

@Controller('recommender')
export class RecommenderController {
  constructor(private readonly neo4jService: Neo4jService) {}

  
  @Get('recommend-by-genre')
  async recommendByGenre(@Request() req) {
    // Verifica que el usuario esté autenticado
    if (!req.session.user) {
      throw new UnauthorizedException('Usuario no autenticado');
    }

    // Obtiene el userId desde la sesión activa
    const userId = req.session.user.userId;

    return await this.neo4jService.recommendByGenre(userId);
  }


  
  @Get('recommend-by-second-genre/:userId')
  async recommendBySecondGenre(@Param('userId') userId: number) {
    return await this.neo4jService.recommendBySecondGenre(userId);
  }

  @Get('recommend-by-artist/:userId')
  async recommendByArtist(@Param('userId') userId: number) {
    return await this.neo4jService.recommendByArtist(userId);
  }

  
  @Get('recommend-artists-by-songs/:userId')
  async recommendArtists(@Param('userId') userId: number) {
    return await this.neo4jService.recommendArtists(userId);
  }

  
    
}
