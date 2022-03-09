import { Controller, Get, Post, UseInterceptors, UploadedFile, UploadedFiles, Res, Param, HttpStatus, UseGuards, HttpCode } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { ApiBearerAuth, ApiHeader, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { diskStorage } from 'multer';
import { ROLE } from 'src/@core/constants';
import { documentFileFilter, editFileName, getAssessmentUploadsDestination, getTraineeAssessmentUploadsDestination, imageFileFilter } from 'src/@core/utils/file-upload.utils';
import { Roles } from 'src/components/auth/decorators';
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

    @Post('blog')
    @UseInterceptors(
        FileInterceptor('file', {
            storage: diskStorage({
                destination: './uploads/blogs',
                filename: editFileName
            }),
            fileFilter: imageFileFilter
        })
    )
    async uploadedBlogFile(@UploadedFile() file) {
        const response = {
            originalname: file.originalname,
            filename: file.filename
        };
        return {
            status: HttpStatus.OK,
            message: 'Image uploaded successfully!',
            data: response,
            imageUrl: `${process.env.API_URL}/files/blog/${file.filename}`
        };
    }

    @Post('note')
    @UseInterceptors(
        FileInterceptor('file', {
            storage: diskStorage({
                destination: './uploads/notes',
                filename: editFileName
            }),
            fileFilter: imageFileFilter
        })
    )
    async uploadedNoteFile(@UploadedFile() file) {
        const response = {
            originalname: file.originalname,
            filename: file.filename
        };
        return {
            status: HttpStatus.OK,
            message: 'Image uploaded successfully!',
            data: response,
            imageUrl: `${process.env.API_URL}/files/note/${file.filename}`
        };
    }

    @Post('assessment')
    @UseInterceptors(
        FileInterceptor('file', {
            storage: diskStorage({
                destination: './uploads/assessments',
                filename: editFileName
            }),
            fileFilter: imageFileFilter
        })
    )
    async uploadedAssessmentFile(@UploadedFile() file) {
        const response = {
            originalname: file.originalname,
            filename: file.filename
        };
        return {
            status: HttpStatus.OK,
            message: 'Image uploaded successfully!',
            data: response,
            imageUrl: `${process.env.API_URL}/files/assessment/${file.filename}`
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

    @Get('/proof-attachment/:filename')
    @HttpCode(HttpStatus.OK)
    @UseGuards(AuthGuard('jwt'))
    @Roles(ROLE.SUPER_ADMIN)
    @ApiBearerAuth()
    @ApiHeader({
        name: 'Bearer',
        description: 'The token we need for auth. Admin roles are only allowed to access this endpoint.'
    })
    @ApiOkResponse({})
    @ApiOperation({ summary: 'Get proof attachment file' })
    getProofAttachment(@Param('filename') filename: string, @Res() res) {
        const response = res.sendFile(filename, {
            root: './uploads/issue-attachments'
        });
        return {
            status: HttpStatus.OK,
            data: response
        };
    }

    @Get('blog/:imagename')
    getBlogImage(@Param('imagename') image, @Res() res) {
        const response = res.sendFile(image, { root: './uploads/blogs' });
        return {
            status: HttpStatus.OK,
            data: response
        };
    }

    @Get('note/:imagename')
    getNoteImage(@Param('imagename') image, @Res() res) {
        const response = res.sendFile(image, { root: './uploads/notes' });
        return {
            status: HttpStatus.OK,
            data: response
        };
    }

    @Get('assessment/:imagename')
    getAssessmentImage(@Param('imagename') image, @Res() res) {
        const response = res.sendFile(image, { root: './uploads/assessments' });
        return {
            status: HttpStatus.OK,
            data: response
        };
    }

    @Get('vaccine-card/:imagename')
    getVaccineCardImage(@Param('imagename') image, @Res() res) {
        const response = res.sendFile(image, { root: './uploads/vaccine-card' });
        return {
            status: HttpStatus.OK,
            data: response
        };
    }

    @Post('upload/assessment')
    @UseInterceptors(
        FilesInterceptor('files', null, {
            storage: diskStorage({
                destination: getAssessmentUploadsDestination,
                filename: editFileName
            }),
            fileFilter: documentFileFilter
        })
    )
    async uploadAssessmentFiles(@UploadedFiles() files) {
        const response = [];
        files.forEach((file) => {
            response.push(file.filename);
        });
        return {
            status: HttpStatus.OK,
            message: 'Files uploaded successfully!',
            data: response
        };
    }

    @Get('assessment-file/:file')
    getAssessmentUploads(@Param('file') image, @Res() res) {
        const response = res.sendFile(image, { root: './uploads/assessment' });
        return {
            status: HttpStatus.OK,
            data: response
        };
    }

    @Post('upload/trainee-assessment')
    @UseInterceptors(
        FilesInterceptor('files', null, {
            storage: diskStorage({
                destination: getTraineeAssessmentUploadsDestination,
                filename: editFileName
            }),
            fileFilter: documentFileFilter
        })
    )
    async uploadTraineeAssessmentFiles(@UploadedFiles() files) {
        const response = [];
        files.forEach((file) => {
            response.push(file.filename);
        });
        return {
            status: HttpStatus.OK,
            message: 'Files uploaded successfully!',
            data: response
        };
    }

    @Get('trainee-assessment-file/:file')
    getTraineeAssessmentFiles(@Param('file') image, @Res() res) {
        const response = res.sendFile(image, {
            root: './uploads/trainee-assessment'
        });
        return {
            status: HttpStatus.OK,
            data: response
        };
    }

    @Get('csv/:fileName')
    @HttpCode(HttpStatus.OK)
    @UseGuards(AuthGuard('jwt'))
    @ApiBearerAuth()
    @ApiHeader({
        name: 'Bearer',
        description: 'The token we need for auth.'
    })
    @ApiOkResponse({})
    @ApiOperation({ summary: 'Get imported csv files' })
    getCsvFile(@Param('fileName') fileName, @Res() res) {
        const response = res.sendFile(fileName, {
            root: './uploads/imported-file'
        });
        return {
            status: HttpStatus.OK,
            data: response
        };
    }

    @Get('csv-import-log/:fileName')
    @ApiBearerAuth()
    @ApiHeader({
        name: 'Bearer',
        description: 'The token we need for auth.'
    })
    @ApiOkResponse({})
    @ApiOperation({ summary: 'Get CSV import log files' })
    getCsvImportLogFile(@Param('fileName') fileName, @Res() res) {
        const response = res.sendFile(fileName, {
            root: './uploads/csv-import-log'
        });
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
