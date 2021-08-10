export interface IAuthRequest {
    scope?: string;
    response_type?: string;
    redirect_uri?: string;
    client_id?: string;
    state?: string;
    acr_values?: string;
    tokenIdp?: string;
    rh_code?:string;
    popup?:boolean;
}
export interface IVerifyTokenIdepRequest {   
    tokenIdp?: string;
    rh_code?:string;
}