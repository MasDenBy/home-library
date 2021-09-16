import { Entity, Column, OneToMany } from "typeorm";

import { BaseEntity } from '../../core/database/base.entity';
import { File } from "../../books/database/file.entity";

@Entity()
export class Library extends BaseEntity {
    @Column({ length: 500 })
    path: string;

    @OneToMany(() => File, file => file.library)
    files: File[];
}