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
}

