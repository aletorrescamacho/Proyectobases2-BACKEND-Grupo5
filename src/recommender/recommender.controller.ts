import { Controller, Get, Param, Request, UnauthorizedException, Body } from '@nestjs/common';
import { Neo4jService } from '../neo4j/neo4j.service';

//funcionan todos los metodos con las sesiones activas

@Controller('recommender')
export class RecommenderController {
  constructor(private readonly neo4jService: Neo4jService) {}

  
  @Get('recommend-by-genre')
async recommendByGenre(@Body('userId') userId: number) {
  if (!userId) {
    throw new UnauthorizedException('Usuario no autenticado');
  }

  return await this.neo4jService.recommendByGenre(userId);
}

@Get('recommend-by-second-genre')
async recommendBySecondGenre(@Body('userId') userId: number) {
  if (!userId) {
    throw new UnauthorizedException('Usuario no autenticado');
  }

  return await this.neo4jService.recommendBySecondGenre(userId);
}

@Get('recommend-by-artist')
async recommendByArtist(@Body('userId') userId: number) {
  if (!userId) {
    throw new UnauthorizedException('Usuario no autenticado');
  }

  return await this.neo4jService.recommendByArtist(userId);
}

  
  @Get('recommend-artists-by-songs')
  async recommendArtists(@Body('userId') userId: number) {
    
    if (!userId) {
      throw new UnauthorizedException('Usuario no autenticado');
    }

    return await this.neo4jService.recommendArtists(userId);
  }

  
    
}
