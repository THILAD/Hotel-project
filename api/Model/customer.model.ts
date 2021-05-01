import { BaseModel } from "./index.model";
export class CustomerModel extends BaseModel{
    command:string;
    code:number;
    messages:string;
    status:string; 
    usercustomer:Usercustomer
}
export class Usercustomer{
    name:string;
    phoneNumber:string;
    password:string;
    photo:string;
    photo_path:string;
    address1:string;
    address2:string;
    last_login:string;
}
