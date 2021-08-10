export interface IServiceItem {
    _id: string;
    client_id: string;
    name: string;
    logo_url: string;
    editable: boolean;
    created_at: Date;
}


export interface IServiceModel{
    num:number;
    id:string;
    code:string;
    value:string;
    enabled:boolean
  }