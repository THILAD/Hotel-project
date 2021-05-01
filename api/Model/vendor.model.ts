// export class VendorModel{
//     command:string
//     code:number;
//     messages:string;
//     status:string; 
//     // jwt:string
//     userVendor:Data
// }
export class Data{
    vendor_id:string
    vendor_role:string
    vendor_name:string
    vendor_phonenumber:string
    vendor_password:string
    vendor_card_id:string
    vendor_photo:string
    vendor_photo_path:string
    vendor_address1:string
    vendor_address2:string
    CreateAt:string
    UpdateAt:string
    isActive:string
    last_login:string
}
//data base name
export class DatabaseVendor{
    vendor_id:string
    vendor_role:string
    vendor_name:string
    vendor_phonenumber:string
    vendor_password:string
    vendor_card_id:string
    vendor_photo:string
    vendor_photo_path:string
    vendor_address1:string
    vendor_address2:string
    CreateAt:string
    UpdateAt:string
    isActive:string
    last_login:string
    validPassword:(password:string)=>boolean;
    hashPassword:(password:string)=>boolean;
}

export class Login{
    vendor_phonenumber:string
    vendor_password:string
}
export class Resgiter{
    jwt:string
    commad:string
    vendor_phonenumber:string
    vendor_password:string
    vendor_password_confirm:string
    
}
export class changePassword{
    vendor_id:string
    jwt:string
    commad:string
    phonenumber:string
    password_old:string
    password_new:string
}
export class ForgotPassword{
    vendor_id:string
    jwt:string
    commad:string
    phonenumber:string
}
