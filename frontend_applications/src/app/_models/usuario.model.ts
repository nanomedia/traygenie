export class UsuarioModel {
    doc: string;
    doc_type: string;
    name?: string;
    first_name?:string
    perfil?: string;
    extra?: IExtraModel;
}

export interface IExtraModel {
    admin?: boolean;
    developer?: string[];
    manager?: string
}