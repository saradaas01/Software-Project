import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

export enum UserRole {
    CITIZEN = 'citizen',
    MODERATOR = 'moderator',
    ADMIN = 'admin',
}

@Entity('users')
export class User {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ unique: true })
    email: string;

    @Column()
    full_name: string;

    @Column()
    password_hash: string;

    @Column({ nullable: true })
    phone: string;

    @Column({ type: 'enum', enum: UserRole, default: UserRole.CITIZEN })
    role: UserRole;

    @Column({ default: false })
    is_verified: boolean;

    @Column({ default: true })
    is_active: boolean;

    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn()
    updated_at: Date;
}