import { Entity, Column, OneToOne, JoinColumn } from "typeorm";

import { BaseEntity } from './base.entity';
import { File } from "./file.entity";

@Entity()
export class Book extends BaseEntity {
    @Column({ length: 1000 })
    title: string;

    @Column({ nullable: true })
    description: string;

    @Column({ nullable: true })
    authors: string;

    @OneToOne(() => File, { cascade: true, onDelete: 'CASCADE' })
    @JoinColumn()
    file: File;
}