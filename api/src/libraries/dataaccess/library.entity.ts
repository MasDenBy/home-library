import { Entity, Column, PrimaryGeneratedColumn } from "typeorm";

import { BaseEntity } from '../../common';

@Entity()
export class Library extends BaseEntity {
    @Column({ length: 500 })
    path: string;
}