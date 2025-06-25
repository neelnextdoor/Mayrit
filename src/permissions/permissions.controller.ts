import { Controller, Post, Body, Get } from '@nestjs/common';
import { PermissionsService } from './permissions.service';
import { CreatePermissionDto } from './dto/create-permission.dto';

@Controller('permissions')
export class PermissionsController {
  constructor(private _permissionService: PermissionsService) {}

  @Post()
  create(@Body() dto: CreatePermissionDto) {
    return this._permissionService.create(dto);
  }

  @Get()
  findAll() {
    return this._permissionService.findAll();
  }
}