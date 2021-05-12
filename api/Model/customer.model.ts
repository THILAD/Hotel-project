import { BaseModel } from "./index.model";

export class CustomerModel extends BaseModel{
    c_id:string
    c_role:string
    c_name:string
    c_phonenumber:string
    c_password:string
    c_card_id:string
    c_avatar:string
    c_avatar_path:string
    c_address1:string
    c_address2:string
    last_login:string
    validPassword:(c_password:string)=>boolean;
    hashPassword:(c_password:string)=>boolean;
}