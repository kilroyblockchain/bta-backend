import { ApiProperty } from '@nestjs/swagger';
import { IUser } from 'src/components/flo-user/user/interfaces/user.interface';
import { IReportDocs } from '../interfaces/monitoring-report.interface';

export class MonitoringReportResponseDto {
    @ApiProperty({
        example: '629f952b7dcf360f4ed86976',
        description: 'Id of the monitoring report',
        format: 'string'
    })
    _id: string;

    @ApiProperty({
        example: 'New Issue',
        description: 'Subject or title of the report',
        format: 'string'
    })
    subject: string;

    @ApiProperty({
        example: 'New Traffic image is not working as per expectation',
        description: 'Details of the report',
        format: 'string'
    })
    description: string;

    @ApiProperty({
        example: [
            {
                docURL: 'version-reports/62a3271e5fdff8cd6b40d8e2-nd6mc8glgb4ekokmprkae15m34qd2sov.jpeg',
                docName: '62a3271e5fdff8cd6b40d8e2-nd6mc8glgb4ekokmprkae15m34qd2sov.jpeg',
                _id: '62aa0cfdbc10d93cc2bb40d3'
            }
        ],

        description: 'Version Creator user details',
        format: 'object'
    })
    documents: Array<IReportDocs>;

    @ApiProperty({
        example: '60895385b0068f003fe9d0d9',
        description: 'Id of user who added the reports',
        format: 'string'
    })
    createdBy: string;

    @ApiProperty({
        example: '60e6fe33d27e2133c485513b',
        description: 'Id of project where version is added',
        format: 'string'
    })
    version: string;

    @ApiProperty({
        example: new Date(),
        description: 'Project version added created date'
    })
    createdAt: Date;

    @ApiProperty({
        example: new Date(),
        description: 'Project version updated date'
    })
    updatedAt: Date;
}

export class VersionAllReportsDto {
    @ApiProperty({
        example: '629f952b7dcf360f4ed86976',
        description: 'Id of the monitoring report',
        format: 'string'
    })
    _id: string;

    @ApiProperty({
        example: 'New Issue',
        description: 'Subject or title of the report',
        format: 'string'
    })
    subject: string;

    @ApiProperty({
        example: 'New Traffic image is not working as per expectation',
        description: 'Details of the report',
        format: 'string'
    })
    description: string;

    @ApiProperty({
        example: [
            {
                docURL: 'version-reports/62a3271e5fdff8cd6b40d8e2-nd6mc8glgb4ekokmprkae15m34qd2sov.jpeg',
                docName: '62a3271e5fdff8cd6b40d8e2-nd6mc8glgb4ekokmprkae15m34qd2sov.jpeg',
                _id: '62aa0cfdbc10d93cc2bb40d3'
            }
        ],

        description: 'Version Creator user details',
        format: 'object'
    })
    documents: Array<IReportDocs>;

    @ApiProperty({
        example: {
            _id: '60895385b0068f003fe9d0d9',
            firstName: 'Suyog',
            lasName: 'Khanal'
        },
        description: 'Version reports added user ',
        format: 'object'
    })
    createdBy: IUser;

    @ApiProperty({
        example: '60e6fe33d27e2133c485513b',
        description: 'Id of project where version is added',
        format: 'string'
    })
    version: string;

    @ApiProperty({
        example: new Date(),
        description: 'Project version added created date'
    })
    createdAt: Date;

    @ApiProperty({
        example: new Date(),
        description: 'Project version updated date'
    })
    updatedAt: Date;
}
