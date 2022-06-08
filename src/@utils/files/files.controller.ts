import { Controller, Get, Res, Param, HttpStatus, UseGuards, Logger } from '@nestjs/common';
import { ApiBearerAuth, ApiHeader, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { ACCESS_TYPE, FEATURE_IDENTIFIER, ROLE } from 'src/@core/constants';
import { Feature, Permission, Roles } from 'src/components/auth/decorators';
import { PermissionGuard } from 'src/components/auth/guards';
import { RolesGuard } from 'src/components/auth/guards/roles.guard';
import { FileService } from './files.service';
import { IFile } from './interfaces/file.interface';

@Controller('files')
@ApiTags('File api')
@UseGuards(RolesGuard)
export class FilesController {
    constructor(private readonly fileService: FileService) {}

    @Get('logs')
    @UseGuards(PermissionGuard)
    @Roles(ROLE.SUPER_ADMIN)
    @Permission(ACCESS_TYPE.READ)
    @Feature(FEATURE_IDENTIFIER.APPLICATION_LOGS)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Get list of application logs' })
    @ApiHeader({
        name: 'Bearer',
        description: 'the token we need for auth.'
    })
    getLogList(): string[] {
        return this.fileService.getLogFiles();
    }

    @Get('logs/:filename')
    @UseGuards(PermissionGuard)
    @Roles(ROLE.SUPER_ADMIN)
    @Permission(ACCESS_TYPE.READ)
    @Feature(FEATURE_IDENTIFIER.APPLICATION_LOGS)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Get log file from log filename' })
    @ApiHeader({
        name: 'Bearer',
        description: 'the token we need for auth.'
    })
    getLogFile(@Param('filename') filename: string, @Res() res): void {
        const logger = new Logger(FilesController.name + '-getLogFile');
        try {
            res.sendFile(filename, {
                root: `./logs`
            });
        } catch (err) {
            logger.error(err);
            throw err;
        }
    }

    @Get(':imagename')
    getImage(@Param('imagename') image, @Res() res): IFile {
        const logger = new Logger(FilesController.name + '-getImage');
        try {
            const response = res.sendFile(image, { root: './uploads' });
            return {
                status: HttpStatus.OK,
                data: response
            };
        } catch (err) {
            logger.error(err);
            throw err;
        }
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
        const logger = new Logger(FilesController.name + '-getFileFromFolder');
        try {
            const response = res.sendFile(fileName, {
                root: `./uploads/${folderName}`
            });
            return {
                status: HttpStatus.OK,
                data: response
            };
        } catch (err) {
            logger.error(err);
            throw err;
        }
    }
}
