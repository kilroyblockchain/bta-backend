export interface IBcModelReview {
    id: string;
    reviewStatus: string;
    comment: string;
    ratings: string;
    entryUserDetail: IEntryUserDetail;
    deployedUrl: string;
    deploymentInstruction: string;
    productionURL: string;
    reviewSupportingDocument: IReviewSupportingDocument[];
}

export interface IReviewSupportingDocument {
    docURL: string;
    docName: string;
}

export interface IEntryUserDetail {
    entryUser: string;
    organizationUnit: string;
    staffing: string;
}
