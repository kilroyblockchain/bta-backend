export interface FLOResponse {
    success: boolean;
    data: any;
    error: Error;
    message: string[];
    statusCode: number;
}
