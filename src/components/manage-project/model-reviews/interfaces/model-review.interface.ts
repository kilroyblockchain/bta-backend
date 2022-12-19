import { Document } from 'mongoose';

export interface IModelReview extends Document {
    _id: string;
    comment: string;
    status: string;
    rating: number;
    version: string;
    documents: Array<IReviewDocs>;
    reviewModel: string;
    deployedModelURL: string;
    deployedModelInstruction: string;
    productionURL: string;
    createdBy: string;
    staffing: string;
    createdAt: Date;
    updatedAt: Date;
}

export interface IReviewDocs {
    _id?: string;
    docURL: string;
    docName: string;
}

export interface IReviewedVersionError {
    errorStatus: boolean;
    logFileDataHashStatus: string;
    testDataSetHashStatus: string;
}
