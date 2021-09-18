import { Body, Controller, Delete, Get, HttpCode, Param, Post } from "@nestjs/common";
import { ApiResponse, ApiTags } from "@nestjs/swagger";
import { LibraryDto } from "./library.dto";
import { LibraryService } from "./services/library.service";

@ApiTags('libraries')
@Controller('libraries')
export class LibrariesController {
    constructor(private libraryService: LibraryService) {}

    @Get()
    @ApiResponse({status: 200})
    public async list(): Promise<LibraryDto[]> {
        return await this.libraryService.list();
    }

    @Get(':id')
    @ApiResponse({status: 200})
    public async getById(@Param('id') id: number): Promise<LibraryDto> {
        return await this.libraryService.getById(id);
    }

    @Post()
    @ApiResponse({status: 201, description: 'The library has been successfully created.'})
    public async create(@Body() dto: LibraryDto): Promise<number> {
        return await this.libraryService.save(dto);
    }

    @Delete(':id')
    @ApiResponse({status: 204, description: 'The library has been successfully deleted'})
    @HttpCode(204)
    public async delete(@Param('id') id: number) {
        await this.libraryService.deleteById(id);
    }

    @Get(':id/index')
    @ApiResponse({status: 200})
    public async index(@Param('id') id: number): Promise<void> {
        await this.libraryService.index(id);
    }
}