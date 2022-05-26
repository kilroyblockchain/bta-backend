import { FLOResponse } from '../interfaces/response.interface';

export class Response implements FLOResponse {
    success: boolean;
    message: string[];
    data: unknown;
    error: Error;
    statusCode: number;
    constructor(success: boolean, message: Array<string>) {
        this.success = success;
        this.message = message;
    }

    setSuccessData(data): this {
        this.data = data;
        return this;
    }

    setError(err): this {
        this.error = err;
        return this;
    }

    setStatus(status: number): this {
        this.statusCode = status;
        return this;
    }
}
