import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Permission } from './permission.entity';
import { CreatePermissionDto } from './dto/create-permission.dto';

@Injectable()
export class PermissionsService {
  constructor(@InjectRepository(Permission) private permissionRepo: Repository<Permission>) {}

  create(dto: CreatePermissionDto) {
    const permission = this.permissionRepo.create(dto);
    return this.permissionRepo.save(permission);
  }

  findAll() {
    return this.permissionRepo.find();
  }
}