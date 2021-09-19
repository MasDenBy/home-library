import { Entity, Column, ManyToOne } from 'typeorm';
import { Library } from '../../libraries/database/library.entity';

import { BaseEntity } from '../../core/database/base.entity';

@Entity()
export class File extends BaseEntity {
  @Column({ length: 500 })
  path: string;

  @Column({ length: 21, nullable: true })
  imageName: string;

  @ManyToOne(() => Library, (library) => library.files, { cascade: true })
  library: Library;
}
