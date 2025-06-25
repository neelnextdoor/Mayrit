import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import {isUUID} from "class-validator";

@Entity('session')
export class Session {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  session_id: string;

  @Column()
  user_id: number;

  @Column({ nullable: true })
  role_id: number;

  @Column({ nullable: true })
  country_id: number;

  @Column({ default: true })
  is_active: boolean;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @Column({ type: 'varchar', length: 255, nullable: true })
  created_by : string

  @Column({ type: 'varchar', length: 255, nullable: true })
  updated_by : string
}