import { Entity, ManyToOne, PrimaryColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Role } from '../role.entity';
import { Permission } from '../../permissions/permission.entity';
import { User } from '../../users/user.entity';

@Entity('role_permissions')
export class RolePermission {
  @PrimaryColumn()
  role_id: number;

  @PrimaryColumn()
  permission_id: number;

  @ManyToOne(() => Role, (role) => role.id, { onDelete: 'CASCADE' })
  role: Role;

  @ManyToOne(() => Permission, (permission) => permission.id, { onDelete: 'CASCADE' })
  permission: Permission;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @ManyToOne(() => User, { nullable: true })
  created_by: User;

  @ManyToOne(() => User, { nullable: true })
  updated_by: User;
}
