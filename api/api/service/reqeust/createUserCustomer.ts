import { CustomerModel } from "../../../Model/customer.model";


export class ApiUservendorReq{
    static successRegister(data:CustomerModel, command:'customerRegister',code:1,messages='resgister successfully',status='success',){
        return {command,code,status,messages,data};
    }
    static errorRegister(data:CustomerModel, command:'customerRegister',code:0,messages=' resgister Error',status='failed'){
        return {command,code,status,messages,data};
    }
    static errorphone(data:CustomerModel, command:'customerRegister',code:0,messages=' Phone Number Is is aleady have in data base',status='failed'){
        return {command,code,status,messages,data};
    }
    static errorpassword(data:CustomerModel, command:'customerRegister',code:0,messages=' password should be 8-16 lenght ',status='failed'){
        return {command,code,status,messages,data};
    }
}