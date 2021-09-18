import { Entity, Column, OneToOne, JoinColumn } from 'typeorm';

import { BaseEntity } from '../../core/database/base.entity';
import { File } from './file.entity';
import { Metadata } from './metadata.entity';

@Entity()
export class Book extends BaseEntity {
  @Column({ length: 1000 })
  title: string;

  @Column({ nullable: true, length: 4000 })
  description: string;

  @Column({ nullable: true })
  authors: string;

  @OneToOne(() => File, { cascade: true, onDelete: 'CASCADE' })
  @JoinColumn()
  file: File;

  @OneToOne(() => Metadata, { cascade: true, onDelete: 'CASCADE' })
  @JoinColumn()
  metadata: Metadata;
}
