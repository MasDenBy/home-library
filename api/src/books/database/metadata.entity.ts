import { Entity, Column } from "typeorm";

import { BaseEntity } from '../../core/database/base.entity';

@Entity()
export class Metadata extends BaseEntity {
    @Column({length:13, nullable: false})
    isbn: string;

    @Column({nullable: true})
    pages: number;

    @Column({nullable: true})
    year: string;
}