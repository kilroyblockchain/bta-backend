export interface IUserData {
    firstName: string;
    lastName: string;
    email: string;
    accessToken?: string;
    refreshToken?: string;
}

export interface CaseyResponse {
    success: boolean;
    message: string;
    errorMessage?: string;
    data?: IUserData | void;
    error?: Error;
}
