import { BadRequestException, Body, Controller, HttpCode, HttpStatus, Param, Post, Req, UploadedFiles, UseGuards, UseInterceptors } from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { createModelReviewDocDestinationFolder, docsFileFilter, editFileName } from 'src/@core/utils/file-upload.utils';
import { ModelReviewService } from './model-review.service';
import { Response as FLOResponse } from 'src/@core/response';
import { ACCESS_TYPE, FEATURE_IDENTIFIER, MANAGE_PROJECT_CONSTANT, ROLE } from 'src/@core/constants';
import { Request } from 'express';
import { AddModelReviewDto, ModelReviewResponseDto } from './dto';
import { PermissionGuard, RolesGuard } from 'src/components/auth/guards';
import { Feature, Permission, Roles } from 'src/components/auth/decorators';
import { ApiBearerAuth, ApiConsumes, ApiHeader, ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { COMMON_ERROR } from 'src/@core/constants/api-error-constants';

@ApiTags('Model Reviews')
@UseGuards(RolesGuard)
@Controller('model-reviews')
export class ModelReviewController {
    constructor(private readonly modelReviewService: ModelReviewService) {}

    @Post(':id')
    @HttpCode(HttpStatus.CREATED)
    @UseGuards(PermissionGuard)
    @Permission(ACCESS_TYPE.WRITE)
    @Feature(FEATURE_IDENTIFIER.MODEL_REVIEWS)
    @Roles(ROLE.STAFF, ROLE.OTHER)
    @ApiBearerAuth()
    @ApiHeader({
        name: 'Bearer',
        description: 'The token we need for auth'
    })
    @ApiOperation({ summary: 'Add model version reviews' })
    @ApiParam({ name: 'id', required: true, description: 'Version Id' })
    @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: COMMON_ERROR.UNAUTHORIZED })
    @ApiResponse({ status: HttpStatus.FORBIDDEN, description: COMMON_ERROR.FORBIDDEN })
    @ApiConsumes('multipart/form-data')
    @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: MANAGE_PROJECT_CONSTANT.UNABLE_TO_ADD_MODEL_REVIEW })
    @ApiResponse({ status: HttpStatus.CREATED, type: ModelReviewResponseDto, description: MANAGE_PROJECT_CONSTANT.NEW_REVIEW_ADD_SUCCESS })
    @ApiResponse({ status: HttpStatus.NOT_FOUND, description: MANAGE_PROJECT_CONSTANT.VERSION_RECORD_NOT_FOUND })
    @UseInterceptors(
        FilesInterceptor('docs', 5, {
            storage: diskStorage({
                destination: createModelReviewDocDestinationFolder,
                filename: editFileName
            }),
            fileFilter: docsFileFilter
        })
    )
    async addModelReview(@Req() req: Request, @Body() newReview: AddModelReviewDto, @UploadedFiles() files: Array<Express.Multer.File>, @Param('id') versionId: string): Promise<FLOResponse> {
        try {
            return new FLOResponse(true, [MANAGE_PROJECT_CONSTANT.NEW_REVIEW_ADD_SUCCESS]).setSuccessData(await this.modelReviewService.addModelReview(req, versionId, files, newReview)).setStatus(HttpStatus.CREATED);
        } catch (err) {
            throw new BadRequestException(MANAGE_PROJECT_CONSTANT.UNABLE_TO_ADD_MODEL_REVIEW, err);
        }
    }
}
