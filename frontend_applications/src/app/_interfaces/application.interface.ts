export interface IAppUpdateRequest {
    id: string;
    name: string;
    description: string;
    url: string;
}

export interface IAppItemResponse {
    client_id: string;
    created_at: string;
    editable: string;
    enabled: string;
    logo_url: string;
    name: string;
    description: string;
    _id: string;
}

export interface IAppOrganization {
    code?: string;
    name?: string;
    acronym?: string;
    domains?: string;
}


export interface IAppOneResponse {
    _id: string;
    organization_code?: string;
    client_id?: string;
    name?: string;
    description?: string;
    url?: string;
    logo_url?: string;
    editable?: boolean;
    enabled?: boolean;
    created_at?: Date;
}

export interface IAppInfoOrgResponse {
    _id: string;
    code: string;
    name: string;
    acronym: string;
    domains: string[];
    created_at: Date;
}

export interface IAppInfoDevResponse {
    doc: string;
    names: string;
    lastname: string;
    created_at: Date | string;
}

export interface IAppInfoResponse {
    app: IAppOneResponse;
    organization: IAppInfoOrgResponse;
    developer: IAppInfoDevResponse;
}