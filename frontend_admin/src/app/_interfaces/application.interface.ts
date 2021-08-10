export interface IApplicationItem {
    _id: string;
    organization_code: string;
    client_id: string;
    name: string;
    description: string;
    url: string;
    logo_url: string;
    editable: boolean;
    enabled: boolean;
    created_at: Date;
}