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
exports.PasswordResetService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const password_reset_token_entity_1 = require("./password_reset_token.entity");
const users_service_1 = require("../users/users.service");
const uuid_1 = require("uuid");
let PasswordResetService = class PasswordResetService {
    constructor(resetRepo, usersService) {
        this.resetRepo = resetRepo;
        this.usersService = usersService;
    }
    async requestReset(email) {
        const user = await this.usersService.findByEmail(email);
        if (!user)
            throw new common_1.NotFoundException('User not found');
        const token = (0, uuid_1.v4)();
        const expiresAt = new Date(Date.now() + 1000 * 60 * 15);
        await this.resetRepo.save({ token, userId: user.id, expiresAt });
        return { token, expiresAt };
    }
    async resetPassword(token, password) {
        const record = await this.resetRepo.findOne({ where: { token } });
        if (!record || record.expiresAt < new Date()) {
            throw new common_1.BadRequestException('Token invalid or expired');
        }
        await this.usersService.updatePassword(record.userId, password);
        await this.resetRepo.delete(record.id);
        return { success: true };
    }
};
exports.PasswordResetService = PasswordResetService;
exports.PasswordResetService = PasswordResetService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(password_reset_token_entity_1.PasswordResetToken)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        users_service_1.UsersService])
], PasswordResetService);
//# sourceMappingURL=password_reset.service.js.map