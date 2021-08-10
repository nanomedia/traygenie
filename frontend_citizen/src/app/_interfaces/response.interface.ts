export interface IResponse<T> {
    success: boolean;
    data?: T;
    Item?: T;
    Items?: T[];
    token?: string;
    service?: string[];
    error?: IError;
    redirectUri?: string;
}

export interface IError {
    code: number;
    message?: string;
}