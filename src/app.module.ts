import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { PasswordResetModule } from './password_reset/password_reset.module';
import { User } from './users/user.entity';
import { PasswordResetToken } from './password_reset/password_reset_token.entity';
import {PdfModule} from "./pdf/pdf.module";
import {ImageModule} from "./image/image.module";

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      useFactory: () => ({
        type: 'mysql',
        host: process.env.DB_HOST,
        port: parseInt(process.env.DB_PORT || '3306', 10),
        username: process.env.DB_USER,
        password: process.env.DB_PASS,
        database: process.env.DB_NAME,
        entities: [User, PasswordResetToken],
        synchronize: true,
      }),
    }),
    UsersModule,
    AuthModule,
    PasswordResetModule,
    PdfModule,
    ImageModule
  ],
})
export class AppModule {}
