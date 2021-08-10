export interface UsuarioRequest {
    doc: string;
    doc_type: string;
}


export interface UsuarioResponse {
    iss: string;
    sub: string;
    aud: string;
    kid: string;
    jti: string;
    doc: string;
    doc_type: string;
    name: string;
    first_name:string;
    extra: Extra;
    iat: number;
    exp: number;
}

export interface Extra {
    admin: boolean;
    developer: any[];
    manager?: any;
}
