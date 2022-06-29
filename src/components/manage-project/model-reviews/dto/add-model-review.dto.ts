import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class AddModelReviewDto {
    @ApiProperty({
        example: 'Reviewing the submitted model',
        description: 'Comment for review the model',
        minLength: 2,
        required: true,
        format: 'string'
    })
    @IsNotEmpty()
    @IsString()
    comment: string;

    @ApiProperty({
        example: 'Reviewing',
        description: 'Reviewed status of model',
        required: true,
        format: 'string'
    })
    @IsNotEmpty()
    @IsString()
    status: string;

    @ApiProperty({
        example: '3',
        description: 'Rating for the version model',
        default: 0,
        required: false,
        format: 'number'
    })
    @IsOptional()
    rating: number;

    @ApiProperty({
        description: 'Id of the new model which is reviewed on deployment status',
        required: false
    })
    @IsOptional()
    @IsString()
    reviewModel: string;

    @ApiProperty({
        description: 'Deployed model URL only added on deployed review status',
        required: false,
        format: 'string'
    })
    @IsOptional()
    @IsString()
    deployedModelURL: string;

    @ApiProperty({
        description: 'Deployed model instruction only added on deployed review status',
        required: false,
        format: 'string'
    })
    @IsOptional()
    @IsString()
    deployedModelInstruction: string;

    @ApiProperty({
        description: 'production URL only added when review status is going to update as production',
        required: false,
        format: 'string'
    })
    @IsOptional()
    @IsString()
    productionURL: string;

    @IsOptional()
    @ApiProperty({
        type: ['file'],
        required: false,
        maxItems: 5,
        description: 'This is document of model review'
    })
    docs: Array<Express.Multer.File>;
}
