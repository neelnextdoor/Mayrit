import {Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn} from 'typeorm';
import {isUUID} from "class-validator";

@Entity('permissions')
export class Permission {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  name: string;

  @Column({ unique: true })
  code: string;

  @Column({ nullable: true })
  description: string;

  @Column({ default: true })
  is_active: boolean;

  @Column({default:isUUID})
  ref_id: string

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @Column({ type: 'varchar', length: 255, nullable: true })
  created_by : string

  @Column({ type: 'varchar', length: 255, nullable: true })
  updated_by : string
}
