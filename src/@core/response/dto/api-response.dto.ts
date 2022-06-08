import { HttpStatus } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';

export class AppResponseDto<TData> {
    @ApiProperty({
        example: true,
        description: 'True if success else false'
    })
    success: boolean;

    @ApiProperty({
        example: ['Successfully ...'],
        description: 'Message'
    })
    message: Array<string>;

    data: TData;

    @ApiProperty({
        example: null
    })
    error: Error;

    @ApiProperty({
        example: HttpStatus.OK
    })
    statusCode: HttpStatus;

    constructor(success: boolean, message: Array<string>) {
        this.success = success;
        this.message = message;
    }

    setSuccessData(data: TData): this {
        this.data = data;
        return this;
    }

    setError(err: Error): this {
        this.error = err;
        return this;
    }

    setStatus(status: HttpStatus): this {
        this.statusCode = status;
        return this;
    }
}

export class PaginatedDto<TData> {
    @ApiProperty({
        example: 1,
        description: 'Page Number'
    })
    page: number;

    @ApiProperty({
        example: 10,
        description: 'Limit'
    })
    limit: number;

    @ApiProperty({
        example: 1,
        description: 'Total'
    })
    total: number;

    docs: TData[];
}
