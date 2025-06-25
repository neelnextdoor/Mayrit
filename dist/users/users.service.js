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
exports.UsersService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const user_entity_1 = require("./user.entity");
const bcrypt = require("bcrypt");
const uuid_1 = require("uuid");
let UsersService = class UsersService {
    constructor(userRepo) {
        this.userRepo = userRepo;
    }
    async create(dto) {
        try {
            const password_hash = await bcrypt.hash(dto.password, 10);
            const user = this.userRepo.create(Object.assign(Object.assign({}, dto), { password_hash, ref_id: (0, uuid_1.v4)() }));
            return this.userRepo.save(user);
        }
        catch (e) {
            console.log(e);
        }
    }
    async updatePassword(userId, newPassword) {
        const password_hash = await bcrypt.hash(newPassword, 10);
        await this.userRepo.update({ id: userId }, { password_hash });
    }
    async validateUser(email, password) {
        const user = await this.userRepo.findOneBy({ email });
        if (!user)
            return null;
        const isMatch = await bcrypt.compare(password, user.password_hash);
        return isMatch ? user : null;
    }
    async findByEmail(email) {
        return this.userRepo.findOneBy({ email });
    }
};
exports.UsersService = UsersService;
exports.UsersService = UsersService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], UsersService);
//# sourceMappingURL=users.service.js.map