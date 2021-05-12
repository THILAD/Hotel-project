
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
    validPassword:(vendor_password:string)=>boolean;
    hashPassword:(vendor_password:string)=>boolean;
}


