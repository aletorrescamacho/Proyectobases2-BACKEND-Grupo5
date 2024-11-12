import { Controller, Get, Param, Request, UnauthorizedException } from '@nestjs/common';
import { Neo4jService } from '../neo4j/neo4j.service';

//funcionan todos los metodos con las sesiones activas

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


  
  @Get('recommend-by-second-genre')
  async recommendBySecondGenre(@Request() req) {
    // Verifica que el usuario esté autenticado
    if (!req.session.user) {
      throw new UnauthorizedException('Usuario no autenticado');
    }

    // Obtiene el userId desde la sesión activa
    const userId = req.session.user.userId;

    return await this.neo4jService.recommendBySecondGenre(userId);
  }

  @Get('recommend-by-artist')
  async recommendByArtist(@Request() req) {
    // Verifica que el usuario esté autenticado
    if (!req.session.user) {
      throw new UnauthorizedException('Usuario no autenticado');
    }

    // Obtiene el userId desde la sesión activa
    const userId = req.session.user.userId;

    return await this.neo4jService.recommendByArtist(userId);
  }

  
  @Get('recommend-artists-by-songs')
  async recommendArtists(@Request() req) {
    // Verifica que el usuario esté autenticado
    if (!req.session.user) {
      throw new UnauthorizedException('Usuario no autenticado');
    }

    // Obtiene el userId desde la sesión activa
    const userId = req.session.user.userId;

    return await this.neo4jService.recommendArtists(userId);
  }

  
    
}
