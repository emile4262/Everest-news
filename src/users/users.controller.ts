// src/modules/users/users.controller.ts
import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
  Request,
  HttpCode,
  HttpStatus,
  UseInterceptors,
  ClassSerializerInterceptor,
  Req,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiQuery,
  ApiParam,
} from '@nestjs/swagger';
import { UsersService } from './users.service';
import { CreateUserDto, UsersQueryDto, ChangePasswordDto, UserResponseDto, PaginatedUsersDto, LoginUserDto, VerifyOtpDto, ResetPasswordDto   } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { JwtAuthGuard,  } from 'src/auth/jwt-auth/jwt-auth.guard';
import { RolesGuard } from 'src/auth/roles.guard';
import { UserRole } from 'generated/prisma';
import { Roles, User } from 'src/auth/public.decorateur';
import { AuthGuard } from '@nestjs/passport';

@ApiTags('Users')
@Controller('users')
// @UseGuards(JwtAuthGuard)
@ApiBearerAuth()
@UseInterceptors(ClassSerializerInterceptor)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  // @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Créer un nouvel utilisateur' })
  @ApiResponse({
    status: 201,
    description: 'Utilisateur créé avec succès',
    type: UserResponseDto,
  })
  @ApiResponse({ status: 409, description: 'Email déjà utilisé' })
  @ApiResponse({ status: 400, description: 'Données invalides' })
  async create(@Body() createUserDto: CreateUserDto): Promise<UserResponseDto> {
    return this.usersService.create(createUserDto);
  }

  // Connexion - PUBLIC
  @Post('login')
  @ApiOperation({ summary: 'Connexion utilisateur' })
  async login(@Body() loginDto: LoginUserDto) {
    const { email, password } = loginDto;
    return this.usersService.login(email, password);
  }

   @UseGuards(JwtAuthGuard, RolesGuard) 
  @Roles(UserRole.EMPLOYEE, UserRole.ADMIN) 
  @Get()
  @ApiOperation({ summary: 'Obtenir tous les utilisateurs avec pagination' })
  @ApiResponse({
    status: 200,
    description: 'Liste des utilisateurs récupérée avec succès',
    type: PaginatedUsersDto,
  })
  @ApiQuery({ name: 'page', required: false, type: Number, example: 1 })
  @ApiQuery({ name: 'limit', required: false, type: Number, example: 10 })
  @ApiQuery({ name: 'role', required: false, enum: UserRole })
  @ApiQuery({ name: 'isActive', required: false, type: Boolean })
  @ApiQuery({ name: 'search', required: false, type: String })
  @ApiQuery({ name: 'sortBy', required: false, type: String, example: 'createdAt' })
  @ApiQuery({ name: 'sortOrder', required: false, enum: ['asc', 'desc'] })
  async findAll(@Query() query: UsersQueryDto): Promise<PaginatedUsersDto> {
    return this.usersService.findAll(query);
  }

  // @Get('me')
  // @ApiOperation({ summary: 'Obtenir les informations de l\'utilisateur connecté' })
  // @ApiResponse({
  //   status: 200,
  //   description: 'Informations utilisateur récupérées avec succès',
  //   type: UserResponseDto,
  // })
  // getProfile(@Req() req: Request) {
  //   return this.usersService.getById(req.user.id);
  // }

//  @UseGuards(JwtAuthGuard, RolesGuard)
//  @Roles(UserRole.ADMIN)
//   @ApiOperation({ summary: 'Obtenir les statistiques des utilisateurs' })
//   @ApiResponse({
//     status: 200,
//     description: 'Statistiques récupérées avec succès',
//     schema: {
//       type: 'object',
//       properties: {
//         total: { type: 'number', example: 100 },
//         active: { type: 'number', example: 85 },
//         inactive: { type: 'number', example: 15 },
//         byRole: {
//           type: 'object',
//           properties: {
//             EMPLOYEE: { type: 'number', example: 70 },
//             MANAGER: { type: 'number', example: 25 },
//             ADMIN: { type: 'number', example: 5 },
//           },
//         },
//       },
//     },
//   })
//   async getStats() {
//     return this.usersService.getStats();
//   }


  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @Get(':id')
  @ApiOperation({ summary: 'Obtenir un utilisateur par ID' })
  @ApiParam({ name: 'id', description: 'ID de l\'utilisateur' })
  @ApiResponse({
    status: 200,
    description: 'Utilisateur trouvé',
    type: UserResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Utilisateur non trouvé' })
  async findOne(@Param('id') id: string): Promise<UserResponseDto> {
    return this.usersService.findOne(id);
  }

  // @UseGuards(AuthGuard, RolesGuard) 
  // @Roles(UserRole.EMPLOYEE, UserRole.ADMIN)
//   @Patch('me')
//   @ApiOperation({ summary: 'Mettre à jour son profil' })
//   @ApiResponse({
//     status: 200,
//     description: 'Profil mis à jour avec succès',
//     type: UserResponseDto,
//   })
//   @ApiResponse({ status: 404, description: 'Utilisateur non trouvé' })
//   @ApiResponse({ status: 409, description: 'Email déjà utilisé' })
//   async updateProfile(
//   @Request() req: any,
//   @Body() updateUserDto: UpdateUserDto,
// ): Promise<UserResponseDto> {
//   const { role, ...allowedUpdates } = updateUserDto;
//   return this.usersService.update(req.user.id, allowedUpdates);
//   }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Mettre à jour un utilisateur (Admin seulement)' })
  @ApiParam({ name: 'id', description: 'ID de l\'utilisateur' })
  @ApiResponse({
    status: 200,
    description: 'Utilisateur mis à jour avec succès',
    type: UserResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Utilisateur non trouvé' })
  @ApiResponse({ status: 409, description: 'Email déjà utilisé' })
  async update(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<UserResponseDto> {
    return this.usersService.update(id, updateUserDto);
  }

  // @UseGuards(JwtAuthGuard, RolesGuard)
  // @Roles(UserRole.ADMIN)
 @Post('forgot-password')
// @UseGuards(JwtAuthGuard, RolesGuard) 
// @Roles(Role.admin, Role.user)
@ApiOperation({ summary: 'Demander un OTP pour réinitialiser le mot de passe (public)' })
async forgotPassword(@Body() dto: ResetPasswordDto) {
  return this.usersService.sendOtp(dto);
}


@Post('reset-password')
// @UseGuards(JwtAuthGuard, RolesGuard) 
// @Roles(Role.admin, Role.user)
@ApiOperation({ summary: 'Réinitialiser le mot de passe avec OTP (public)' })
async resetPassword(@Body() dto: VerifyOtpDto) {
  return this.usersService.resetPasswordWithOtp(dto);
}

  // @UseGuards(JwtAuthGuard, RolesGuard)
  // @Roles(UserRole.ADMIN)
  @Patch(':id/activate')
  @ApiOperation({ summary: 'Activer un utilisateur (Admin seulement)' })
  @ApiParam({ name: 'id', description: 'ID de l\'utilisateur' })
  @ApiResponse({
    status: 200,
    description: 'Utilisateur activé avec succès',
    type: UserResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Utilisateur non trouvé' })
  async activate(@Param('id') id: string): Promise<UserResponseDto> {
    return this.usersService.activate(id);
  }

  // @UseGuards(JwtAuthGuard, RolesGuard)
  // @Roles(UserRole.ADMIN)
  @Patch(':id/deactivate')
  @ApiOperation({ summary: 'Désactiver un utilisateur (Admin seulement)' })
  @ApiParam({ name: 'id', description: 'ID de l\'utilisateur' })
  @ApiResponse({
    status: 200,
    description: 'Utilisateur désactivé avec succès',
    type: UserResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Utilisateur non trouvé' })
  async deactivate(@Param('id') id: string): Promise<UserResponseDto> {
    return this.usersService.deactivate(id);
  }

  // @UseGuards(JwtAuthGuard, RolesGuard)
  // @Roles(UserRole.ADMIN)
  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Supprimer un utilisateur (soft delete - Admin seulement)' })
  @ApiParam({ name: 'id', description: 'ID de l\'utilisateur' })
  @ApiResponse({
    status: 200,
    description: 'Utilisateur supprimé avec succès',
    schema: {
      type: 'object',
      properties: {
        message: { type: 'string', example: 'Utilisateur supprimé avec succès' },
      },
    },
  })
  @ApiResponse({ status: 404, description: 'Utilisateur non trouvé' })
  async remove(@Param('id') id: string) {
    return this.usersService.remove(id);
  }

  @Delete(':id/hard')
  // @UseGuards(JwtAuthGuard, RolesGuard)
  // @Roles(UserRole.ADMIN)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Supprimer définitivement un utilisateur (Admin seulement)' })
  @ApiParam({ name: 'id', description: 'ID de l\'utilisateur' })
  @ApiResponse({
    status: 200,
    description: 'Utilisateur supprimé définitivement',
    schema: {
      type: 'object',
      properties: {
        message: { type: 'string', example: 'Utilisateur supprimé définitivement' },
      },
    },
  })
  @ApiResponse({ status: 404, description: 'Utilisateur non trouvé' })
  async hardDelete(@Param('id') id: string) {
    return this.usersService.hardDelete(id);
  }
}