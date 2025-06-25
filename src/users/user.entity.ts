import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import {isUUID} from "class-validator";

@Entity('users')
export class User {
  @PrimaryGeneratedColumn({type:"bigint"})
  id: number;

  @Column({ unique: true })
  email: string;

  @Column()
  name: string;

  @Column()
  password_hash: string;

  @Column({default:isUUID})
  ref_id: string

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
