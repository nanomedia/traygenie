export interface IResponse<T> {
    success: boolean;
    data?: T;
    Item?: T;
    error?: IError;
    redirectUri?: string;
}

export interface IError {
    code?: number;
    message?: string;
}