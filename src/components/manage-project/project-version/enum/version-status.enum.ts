export enum VersionStatus {
    PENDING = 'Pending',
    REVIEW = 'Reviewing',
    REVIEW_PASSED = 'Review Passed',
    REVIEW_FAILED = 'Review Failed',
    PRODUCTION = 'Production',
    DEPLOYED = 'Deployed',
    MONITORING = 'Monitoring',
    COMPLETE = 'Complete',
    DRAFT = 'Draft',
    QA_STATUS = 'Question Answer'
}

export enum OracleBucketDataStatus {
    FETCHING = 'fetching',
    FETCHED = 'fetched',
    ERROR = 'error'
}
