import { Controller, Get, Query, Param } from '@nestjs/common';
import { Neo4jService } from '../neo4j/neo4j.service';

@Controller('search')
export class SearchController {
  constructor(private readonly neo4jService: Neo4jService) {}

  // Método para buscar una canción por nombre
  @Get('song/:name')
  async searchSong(@Param('name') name: string) {
    return this.neo4jService.findSongByName(name);
  }

  // Método para buscar un artista por nombre
  @Get('artist/:name')
  async searchArtist(@Param('name') name: string) {
    return this.neo4jService.findArtistByName(name);
  }
}
