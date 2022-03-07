import { FLOResponse } from '../interfaces/response.interface';

export class Response implements FLOResponse {
    success: boolean;
    message: string[];
    data: any;
    error: Error;
    statusCode: number;
    constructor(success: boolean, message: Array<string>) {
        this.success = success;
        this.message = message;
    }

    setSuccessData(data: any) {
        this.data = data;
        return this;
    }

    setError(err: any) {
        this.error = err;
        return this;
    }

    setStatus(status: number) {
        this.statusCode = status;
        return this;
    }
}
