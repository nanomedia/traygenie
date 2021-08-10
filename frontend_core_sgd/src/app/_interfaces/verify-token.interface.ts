export interface IVerifyTokenResponse {
    success?: boolean;
    acr?: string;
    reqId?: string;
    cancelUri?: string;
    changeAcrUri?:string;
    token?:string;
}

export interface IVerifyTokenModel {
   
    acr: string;
    reqId: string;
    cancelUri?: string;
    changeAcrUri?:string;
}

export interface IVerifyDocRequest {
    reqId: string;
    doc: string;
    recaptcha: string;
}

export interface IVerifyPasswordRequest {
    reqId: string;
    doc: string;
    password: string;
    recaptcha: string;
}