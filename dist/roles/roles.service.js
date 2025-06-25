"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RolesService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const role_entity_1 = require("./role.entity");
const permission_entity_1 = require("../permissions/permission.entity");
const role_permission_entity_1 = require("./entities/role-permission.entity");
let RolesService = class RolesService {
    constructor(roleRepo, permissionRepo, dataSource) {
        this.roleRepo = roleRepo;
        this.permissionRepo = permissionRepo;
        this.dataSource = dataSource;
    }
    create(dto) {
        const role = this.roleRepo.create(dto);
        return this.roleRepo.save(role);
    }
    findAll() {
        return this.roleRepo.find();
    }
    async assignPermissions(roleId, permissionIds) {
        const role = await this.roleRepo.findOneBy({ id: roleId });
        if (!role)
            throw new common_1.NotFoundException('Role not found');
        await this.dataSource.transaction(async (manager) => {
            await manager.delete(role_permission_entity_1.RolePermission, { role_id: roleId });
            const inserts = permissionIds.map(pid => {
                const rp = new role_permission_entity_1.RolePermission();
                rp.role_id = roleId;
                rp.permission_id = pid;
                return rp;
            });
            await manager.save(role_permission_entity_1.RolePermission, inserts);
        });
    }
};
exports.RolesService = RolesService;
exports.RolesService = RolesService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(role_entity_1.Role)),
    __param(1, (0, typeorm_1.InjectRepository)(permission_entity_1.Permission)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.DataSource])
], RolesService);
//# sourceMappingURL=roles.service.js.map