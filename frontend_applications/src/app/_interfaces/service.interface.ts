export interface IServiceEnabledRequest {

    id: string;
    service_code: string;
}

export interface IServiceUpdateRequest {
    id: string;
    service_code?: string;
    mac_authorized?:string;
    tos_url?: string;
    policy_url?: string;
    redirect_uris?: string;
    js_origin_uris?: string;
}

export interface IServiceUpdateAuthRequest {
    id: string;
    authorization_url?: string;
    authorization_url_token?:string;
}



export interface IServiceOneResponse {
    _id: string;
    client_id: string;
    client_secret: string;
    organization_code: string;
    service_code: string;
    tos_url: string;
    policy_url: string;
    redirect_uris: any[];
    js_origin_uris: any[];
    mac_authorized?:any[];
    editable: boolean;
    created_at: Date;
}