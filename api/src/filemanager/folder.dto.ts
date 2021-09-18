import { ApiProperty } from "@nestjs/swagger";

export class FolderDto implements Readonly<FolderDto> {
    @ApiProperty({type: String})
    path: string;

    @ApiProperty({type: [String]})
    folders: string[];
}