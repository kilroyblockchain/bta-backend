import { Controller, Get, Post, UseInterceptors, UploadedFile, UploadedFiles, Res, Param, HttpStatus, UseGuards } from '@nestjs/common';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { ApiBearerAuth, ApiHeader, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { diskStorage } from 'multer';
import { editFileName, imageFileFilter } from 'src/@core/utils/file-upload.utils';
import { RolesGuard } from 'src/components/auth/guards/roles.guard';

@Controller('files')
@ApiTags('File api')
@UseGuards(RolesGuard)
export class FilesController {
    @Post()
    @UseInterceptors(
        FileInterceptor('image', {
            storage: diskStorage({
                destination: './uploads',
                filename: editFileName
            }),
            fileFilter: imageFileFilter
        })
    )
    async uploadedFile(@UploadedFile() file) {
        const response = {
            originalname: file.originalname,
            filename: file.filename,
            url: `${process.env.API_URL}/files/${file.filename}`
        };
        return {
            status: HttpStatus.OK,
            message: 'Image uploaded successfully!',
            data: response
        };
    }

    @Post('uploadMultipleFiles')
    @UseInterceptors(
        FilesInterceptor('image', 10, {
            storage: diskStorage({
                destination: './uploads',
                filename: editFileName
            }),
            fileFilter: imageFileFilter
        })
    )
    async uploadMultipleFiles(@UploadedFiles() files) {
        const response = [];
        files.forEach((file) => {
            const fileReponse = {
                originalname: file.originalname,
                filename: file.filename
            };
            response.push(fileReponse);
        });
        return {
            status: HttpStatus.OK,
            message: 'Images uploaded successfully!',
            data: response
        };
    }

    @Get(':imagename')
    getImage(@Param('imagename') image, @Res() res) {
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
    getFileFromFolder(@Param('folderName') folderName, @Param('fileName') fileName, @Res() res) {
        const response = res.sendFile(fileName, {
            root: `./uploads/${folderName}`
        });
        return {
            status: HttpStatus.OK,
            data: response
        };
    }
}
