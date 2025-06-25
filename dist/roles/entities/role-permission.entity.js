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
Object.defineProperty(exports, "__esModule", { value: true });
exports.RolePermission = void 0;
const typeorm_1 = require("typeorm");
const role_entity_1 = require("../role.entity");
const permission_entity_1 = require("../../permissions/permission.entity");
const user_entity_1 = require("../../users/user.entity");
let RolePermission = class RolePermission {
};
exports.RolePermission = RolePermission;
__decorate([
    (0, typeorm_1.PrimaryColumn)(),
    __metadata("design:type", Number)
], RolePermission.prototype, "role_id", void 0);
__decorate([
    (0, typeorm_1.PrimaryColumn)(),
    __metadata("design:type", Number)
], RolePermission.prototype, "permission_id", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => role_entity_1.Role, (role) => role.id, { onDelete: 'CASCADE' }),
    __metadata("design:type", role_entity_1.Role)
], RolePermission.prototype, "role", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => permission_entity_1.Permission, (permission) => permission.id, { onDelete: 'CASCADE' }),
    __metadata("design:type", permission_entity_1.Permission)
], RolePermission.prototype, "permission", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], RolePermission.prototype, "created_at", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], RolePermission.prototype, "updated_at", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User, { nullable: true }),
    __metadata("design:type", user_entity_1.User)
], RolePermission.prototype, "created_by", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User, { nullable: true }),
    __metadata("design:type", user_entity_1.User)
], RolePermission.prototype, "updated_by", void 0);
exports.RolePermission = RolePermission = __decorate([
    (0, typeorm_1.Entity)('role_permissions')
], RolePermission);
//# sourceMappingURL=role-permission.entity.js.map