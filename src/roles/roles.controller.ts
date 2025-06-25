import {Controller, Post, Body, Get, Patch, Param} from '@nestjs/common';
import { RolesService } from './roles.service';
import { CreateRoleDto } from './dto/create-role.dto';

@Controller('roles')
export class RolesController {
  constructor(private service: RolesService) {}

  @Post()
  create(@Body() dto: CreateRoleDto) {
    return this.service.create(dto);
  }

  @Get()
  findAll() {
    return this.service.findAll();
  }

  @Patch(':id/permissions')
    assignPermissions(@Param('id') roleId: number, @Body('permissions') permissionIds: number[]) {
    return this.service.assignPermissions(roleId, permissionIds);
  }
}