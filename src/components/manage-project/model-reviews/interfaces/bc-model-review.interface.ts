export interface IBcModelReview {
    id: string;
    reviewStatus: string;
    comment: string;
    ratings: string;
    entryUserDetail: IEntryUserBcDetail;
    deployedUrl: string;
    deploymentInstruction: string;
    productionURL: string;
    reviewSupportingDocument: IReviewSupportingDocument[];
}

export interface IReviewSupportingDocument {
    docURL: string;
    docName: string;
}

export interface IEntryUserBcDetail {
    entryUser: string;
    organizationUnit: string;
    staffing: string;
}
