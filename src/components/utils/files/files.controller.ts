import { Controller, Get, Res, Param, HttpStatus, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiHeader, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { RolesGuard } from 'src/components/auth/guards/roles.guard';
import { IFile } from './interfaces/file.interface';

@Controller('files')
@ApiTags('File api')
@UseGuards(RolesGuard)
export class FilesController {
    @Get(':imagename')
    getImage(@Param('imagename') image, @Res() res): IFile {
        const response = res.sendFile(image, { root: './uploads' });
        return {
            status: HttpStatus.OK,
            data: response
        };
    }

    @Get('file/:folderName/:fileName')
    @ApiBearerAuth()
    @ApiHeader({
        name: 'Bearer',
        description: 'The token we need for auth.'
    })
    @ApiOkResponse({})
    @ApiOperation({ summary: 'Get CSV import log files' })
    getFileFromFolder(@Param('folderName') folderName, @Param('fileName') fileName, @Res() res): IFile {
        const response = res.sendFile(fileName, {
            root: `./uploads/${folderName}`
        });
        return {
            status: HttpStatus.OK,
            data: response
        };
    }
}
