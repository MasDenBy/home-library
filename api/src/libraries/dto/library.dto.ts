import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber } from 'class-validator';
import { Library } from '../database/library.entity';

export class LibraryDto implements Readonly<LibraryDto> {
  @ApiProperty({ required: false, type: Number })
  @IsNumber()
  id: number;

  @ApiProperty({ required: true, type: String })
  @IsNotEmpty()
  path: string;

  public static fromEntity(entity: Library): LibraryDto {
    return {
      id: entity.id,
      path: entity.path,
    };
  }

  public static toEntity(dto: LibraryDto): Library {
    const library = new Library();
    library.id = dto.id;
    library.path = dto.path;
    return library;
  }
}
