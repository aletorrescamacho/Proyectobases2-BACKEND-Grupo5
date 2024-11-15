import { Controller, Get, Query, Param, Post, Body } from '@nestjs/common';
import { Neo4jService } from '../neo4j/neo4j.service';

@Controller('search')
export class SearchController {
  constructor(private readonly neo4jService: Neo4jService) {}

  // Método para buscar una canción por nombre
  @Post('search-song')
  async searchSong(@Body('name') name: string) {
    return this.neo4jService.findSongByName(name);
  }

  // Método para buscar un artista por nombre
  @Post('search-artist')
  async searchArtist(@Body('name') name: string) {
    return this.neo4jService.findArtistByName(name);
  }

  // En tu controlador de canciones, añade este método
@Post('check-favorite')
async checkFavorite(@Body('userId') userId: string, @Body('trackId') trackId: string) {
  return this.neo4jService.isFavorite(userId, trackId);
}

}

