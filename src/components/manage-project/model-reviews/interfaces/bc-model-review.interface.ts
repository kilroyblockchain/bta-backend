export interface IBcModelReview {
    id: string;
    reviewStatus: string;
    comment: string;
    ratings: string;
    entryUserDetail: IEntryUserBcDetail;
    deployedUrl: string;
    deploymentInstruction: string;
    productionURL: string;
    reviewedModelVersionId: string;
    reviewDocuments: IReviewSupportingDocument[];
}

export interface IReviewSupportingDocument {
    docUrl: string;
    docName: string;
}

export interface IEntryUserBcDetail {
    entryUser: string;
    organizationUnit: string;
    staffing: string;
}

export interface IBcVersionSubmitReview {
    id: string;
    reviewStatus: string;
    entryUserDetail: IEntryUserBcDetail;
}
