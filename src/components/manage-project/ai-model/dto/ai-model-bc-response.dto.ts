import { ApiProperty } from '@nestjs/swagger';
import { IBcModelVersion, IBcProject } from '../interfaces/ai-model-bc-experiment.interface';

export class BcModelExperimentDetailsDto {
    @ApiProperty({
        example: 'exp_0',
        description: 'Experiment name'
    })
    experimentName: string;

    @ApiProperty({
        example: 'e202b86e0e58026994616fa5957a3a199ffc7d7b2b421365c30ed1b238b2b252',
        description: 'hash of experiment data'
    })
    experimentBcHash: string;

    @ApiProperty({
        example: {
            id: '62f53c65ff1b73d5e18d1b86',
            versionName: 'v1'
        },
        description: 'Details of model version'
    })
    modelVersion: IBcModelVersion;

    @ApiProperty({
        example: {
            id: '62efd37ef24e4b26ff79c760',
            projectName: 'TSD'
        },
        description: 'Details of project'
    })
    project: IBcProject;

    @ApiProperty({
        example: new Date(),
        description: 'Recorded date of experiment in blockchain state'
    })
    recordDate: Date;

    @ApiProperty({
        example: 'cavakoh@mailinator.com',
        description: 'Email address of user who invoke experiment in BC'
    })
    entryUser: string;

    @ApiProperty({
        example: 'PeerDs1MainnetBtaKilroyMSP',
        description: 'MSP name'
    })
    creatorMSP: string;
}

export class BcModelExperimentHistoryDto {
    @ApiProperty({
        example: '92af9443a6ba663309318647c88f4931cad444cf4cff90ecfedb15957b856c76',
        description: 'blockchain transaction Id'
    })
    txId: string;

    @ApiProperty({
        example: false,
        description: 'Name of version',
        format: 'boolean'
    })
    isDeleted: boolean;

    @ApiProperty({
        example: BcModelExperimentDetailsDto,
        description: 'Data of model experiment',

        format: 'object'
    })
    modelExperiment: BcModelExperimentDetailsDto;
}
