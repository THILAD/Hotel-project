import { VendorModel,Data } from "../../../Model/vendor.model";
export class ApiUserRes{
 static   successRegister(data:Data, command:string="vendorRegister",code:1,){
        return {data,command,code};
    }
    static errorRegister(data:Data, command:'vendorRegister',code:0){
        return {command,code,data};
    }
    static errorphone(data:any, command:'vendorRegister',code:0,messages='  Phone Number Is is aleady have in data base',status='failed'){
        return {command,code,status,messages,data};
    }
    static errorpassword(data:any, command:'vendorRegister',code:0,messages=' password should be 8-16 lenght ',status='failed'){
        return {command,code,status,messages,data};
    }

    // authentication Venndor
    static loginVendor(data:any, command:'vendorlogin',code:1,messages='login successfully  ',status='success'){
        return {command,code,status,messages,data};
    }
    static loginErrorPhone(data:any, command:'vendorlogin',code:0,messages=' phone number was wrong! ',status='failed'){
        return {command,code,status,messages,data};
    }
    static loginErrorPasswrod(data:any, command:'vendorlogin',code:0,messages='Password was wrong! ',status='failed'){
        return {command,code,status,messages,data};
    }
    static loginErrorblock(data:any, command:'vendorlogin',code:0,messages=" this user is banned wait for addmin unband" ,status='failed'){
        return {command,code,status,messages,data};
    }
    
    // authentication Customer
    static loginCustomer(data:any, command:'vendorlogin',code:1,messages="login successfully",status:string='success'){
        return {command,code,status,messages,data};
    }
    static loginCustomerErrorPhone(data:any, command:'vendorlogin',code:0,messages=' phone number was wrong! ',status='failed'){
        return {command,code,status,messages,data};
    }
    static loginErrorCustomerPasswrod(data:any, command:'vendorlogin',code:0,messages='Password was wrong! ',status='failed'){
        return {command,code,status,messages,data};
    }
    static loginErrorCustomerblock(data:any, command:'vendorlogin',code:0,messages=" this user is banned wait for addmin unband" ,status='failed'){
        return {command,code,status,messages,data};
    }
    
}