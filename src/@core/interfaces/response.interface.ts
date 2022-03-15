export interface FLOResponse {
    success: boolean;
    data: unknown;
    error: Error;
    message: string[];
    statusCode: number;
}
