export interface IVersionRequest {
    id?: string;
    service_code?: string;
    version_number?: string;
    value?: any;
}

export interface IVersionResponse {
    _id: string;
    service_code: string;
    version_number: string;
    version_code: string;
    enabled: boolean;
    created_at: Date;
}