import { Document } from 'mongoose';

export interface IExperiment extends Document {
    _id: string;
    projectVersion: string;
    experimentVersion: string;
    codeVersion: string;
    codeRepoLink: string;
    notebookVersion: string;
    model: string;
    trainDataSetLink: string;
    testDataSetLink: string;
    framework: string;
    frameworkVersion: string;
    logFileLink: string;
    parameters: string;
    performanceMetrics: string;
    status: boolean;
    user: string;
    project: string;
}

export interface IExperimentResponse extends Document {
    _id: string;
    projectVersion: string;
    project: string;
    logFileLink: string;
    user: string;
}
