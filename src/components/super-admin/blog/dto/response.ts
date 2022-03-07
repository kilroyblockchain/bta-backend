import { IBlogResponse } from '../interfaces/response.interface';

export class ResponseDto implements IBlogResponse {
    success: boolean;
    message: string[];
    data: any;
    error: Error;
    statusCode: number;
    constructor(success: boolean, status: number, message: string[], data: any) {
        this.success = success;
        this.message = message;
        this.success ? (this.data = <any>data) : (this.data = null);
        this.success ? (this.error = null) : (this.error = <Error>data);
        this.statusCode = status;
    }
}
