export interface IResponse {
    success: boolean;
    data: any;
    error: Error;
    message: string[];
    statusCode: number;
}
