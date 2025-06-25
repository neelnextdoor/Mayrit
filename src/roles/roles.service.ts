import {Injectable, NotFoundException} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {DataSource, Repository} from 'typeorm';
import { Role } from './role.entity';
import { CreateRoleDto } from './dto/create-role.dto';
import {Permission} from "../permissions/permission.entity";
import { RolePermission } from './entities/role-permission.entity';


@Injectable()
export class RolesService {
  constructor(
      @InjectRepository(Role) private roleRepo: Repository<Role>,
      @InjectRepository(Permission) private permissionRepo: Repository<Permission>,
    private dataSource: DataSource
  ) {}

  create(dto: CreateRoleDto) {
    const role = this.roleRepo.create(dto);
    return this.roleRepo.save(role);
  }

  findAll() {
    return this.roleRepo.find();
  }

  async assignPermissions(roleId: number, permissionIds: number[]) {
    const role = await this.roleRepo.findOneBy({ id: roleId });
    if (!role) throw new NotFoundException('Role not found');

    await this.dataSource.transaction(async manager => {
      await manager.delete(RolePermission, { role_id: roleId });

      const inserts = permissionIds.map(pid => {
        const rp = new RolePermission();
        rp.role_id = roleId;
        rp.permission_id = pid;
        return rp;
      });

      await manager.save(RolePermission, inserts);
    });
  }

}
