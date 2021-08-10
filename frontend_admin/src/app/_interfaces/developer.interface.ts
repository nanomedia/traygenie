export interface IDeveloperInsertRequest {
    token: string;
    phone: string;
    email: string;
    position: string;
}

export interface IDeveloperUpdateRequest {
    id: string;
    phone: string;
    email: string;
    position: string;
}

export interface IDeveloperOne {
    _id: string;
    doc: string;
    doc_type: string;
    names: string;
    lastname_1: string;
    lastname_2: string;
    lastname_3: string;
    phone: string;
    email: string;
    position: string;
    created_at: Date;
}

export interface IDeveloperItem {
    _id: string;
    doc: string;
    doc_type: string;
    names: string;
    lastname_1: string;
    lastname_2: string;
    lastname_3: string;
    phone: string;
    email: string;
    created_at: Date;
}