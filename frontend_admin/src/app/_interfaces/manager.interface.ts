export interface IManagerInsertRequest {
    token: string;
    organization_code: string;
    phone: string;
    email: string;
    position: string;
}
export interface IManagerUpdateRequest {
    id: string;    
    phone: string;
    email: string;
    position: string;
}


export interface IManagerItem {
    _id: string;
    doc: string;
    doc_type: string;
    names: string;
    lastname_1: string;
    lastname_2: string;
    lastname_3: string;
    position?:string;
    phone: string;
    email: string;
    created_at: Date;
}
