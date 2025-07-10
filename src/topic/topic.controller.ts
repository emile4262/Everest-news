import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  ParseBoolPipe,
  HttpCode,
  HttpStatus,
  UseGuards,
  UseInterceptors,
  ClassSerializerInterceptor,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery, ApiBearerAuth, ApiParam } from '@nestjs/swagger';
import { CreateTopicDto, PaginatedTopicsDto, TopicQueryDto } from './dto/create-topic.dto';
import { UpdateTopicDto } from './dto/update-topic.dto';
import { TopicsService } from './topic.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth/jwt-auth.guard';
import { RolesGuard } from 'src/auth/roles.guard';
import { UserRole } from 'generated/prisma';
import { Roles } from 'src/auth/public.decorateur';

@ApiTags('topics')
@ApiBearerAuth()
@UseInterceptors(ClassSerializerInterceptor)
@Controller('topics')
export class TopicsController {
  constructor(private readonly topicsService: TopicsService) {}

  @UseGuards(JwtAuthGuard, RolesGuard) 
  @Roles(UserRole.EMPLOYEE, UserRole.ADMIN, UserRole.MANAGER) 
  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Créer un nouveau topic' })
  @ApiResponse({
    status: 201,
    description: 'Topic créé avec succès',
    type: 'TopicResponseDto',
  })
  create(@Body() createTopicDto: CreateTopicDto) {
    return this.topicsService.create(createTopicDto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard) 
  @Roles(UserRole.EMPLOYEE, UserRole.ADMIN, UserRole.MANAGER) 
  @Get()
  @ApiOperation({ summary: 'Obtenir tous les topics avec pagination' })
  @ApiResponse({
    status: 200,
    description: 'Liste des topics récupérée avec succès',
    type: PaginatedTopicsDto,
  })
  @ApiQuery({ name: 'page', required: false, type: Number, example: 1 })
  @ApiQuery({ name: 'limit', required: false, type: Number, example: 10 })
  @ApiQuery({ name: 'isActive', required: false, type: Boolean })
  @ApiQuery({ name: 'search', required: false, type: String })
  @ApiQuery({ name: 'sortBy', required: false, type: String, example: 'createdAt' })
  @ApiQuery({ name: 'sortOrder', required: false, enum: ['asc', 'desc'] })
  async findAll(@Query() query: TopicQueryDto): Promise<PaginatedTopicsDto> {
    return this.topicsService.findAll(query);
  }

  @UseGuards(JwtAuthGuard, RolesGuard) 
  @Roles(UserRole.EMPLOYEE, UserRole.ADMIN, UserRole.MANAGER) 
  @Get('active')
  @ApiOperation({ summary: 'Obtenir tous les sujets avec pagination' })
    @ApiResponse({
      status: 200,
      description: 'Liste des sujets récupérée avec succès',
      type: PaginatedTopicsDto,
    })
  findActive() {
   return this.topicsService.findActive();
  }

  @UseGuards(JwtAuthGuard, RolesGuard) 
  @Roles(UserRole.EMPLOYEE, UserRole.ADMIN, UserRole.MANAGER) 
  @Get('name/:name')
  @ApiOperation({ summary: 'Obtenir tous les noms des sujets  avec pagination' })
    @ApiResponse({
      status: 200,
      description: 'Liste les noms des sujets récupérée avec succès',
      type: PaginatedTopicsDto,
    })
  findByName(@Param('name') name: string) {
    return this.topicsService.findByName(name);
  }

  @UseGuards(JwtAuthGuard, RolesGuard) 
  @Roles(UserRole.EMPLOYEE, UserRole.ADMIN, UserRole.MANAGER) 
  @Get(':id')
   @ApiOperation({ summary: 'Obtenir un sujet par un id  ' })
    @ApiResponse({
      status: 200,
      description: 'Liste un sujet par son  id récupérée avec succès',
      type: PaginatedTopicsDto,
    })
  findOne(@Param('id') id: string) {
    return this.topicsService.findOne(id);
  }

  @UseGuards(JwtAuthGuard, RolesGuard) 
  @Roles(UserRole.EMPLOYEE, UserRole.ADMIN, UserRole.MANAGER) 
  @Get(':id/stats')
  getTopicStats(@Param('id') id: string) {
    return this.topicsService.getTopicStats(id);
  }

  @UseGuards(JwtAuthGuard, RolesGuard) 
  @Roles(UserRole.EMPLOYEE, UserRole.ADMIN, UserRole.MANAGER) 
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateTopicDto: UpdateTopicDto) {
    return this.topicsService.update(id, updateTopicDto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard) 
  @Roles(UserRole.EMPLOYEE, UserRole.ADMIN, UserRole.MANAGER) 
  @Patch(':id/toggle-active')
  @ApiOperation({ summary: 'Mettre à jour un utilisateur (Admin seulement)' })
    @ApiParam({ name: 'id', description: 'basculer en active ou desactivé' })
    @ApiResponse({
      status: 200,
      description: 'sujet mis à jour avec succès',
    })
  toggleActive(@Param('id') id: string) {
    return this.topicsService.toggleActive(id);
  }

  @UseGuards(JwtAuthGuard, RolesGuard) 
  @Roles(UserRole.EMPLOYEE, UserRole.ADMIN, UserRole.MANAGER) 
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id') id: string) {
    return this.topicsService.remove(id);
  }
}