import { Entity, Column } from "typeorm";

import { BaseEntity } from '../../common';

@Entity()
export class Library extends BaseEntity {
    @Column({ length: 500 })
    path: string;
}