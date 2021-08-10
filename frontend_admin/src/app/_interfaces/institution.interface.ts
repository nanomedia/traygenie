import { IApplicationItem } from "./application.interface";

export interface IOrganizationApplication {
    organization: IOrganization;
    countApp: number;
    countDev: number;
}

export interface IOrgInfoAppRequest {
    app: IApplicationItem;
    services: IService[];
}

export interface IOrganization {
    _id: string;
    code: string;
    name: string;
    acronym: string;
    domains: string[];
    logo_url: string;
    created_at: Date;
}

export interface IService {
    _id?: string;
    service_code: string;
    enabled: boolean;
    blocked: boolean;
}

export interface IInstitutionData {
    organization: IOrganization;
    services: IService[];
}


export interface IServiceRequest {
    code: string;
    enabled: boolean;
    blocked: boolean;
}

export interface IOrganizationUpdateRequest {
    id?: string;
    token?: string;
    acronym: string;
    domains: string;
    services: IServiceRequest[];
}