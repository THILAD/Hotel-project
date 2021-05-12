//import * as jwt from 'jsonwebtoken';
const jwt = require('jsonwebtoken');
import { VendorModel } from '../api/entities/vendorEntity';
import { Request } from 'express';
export class APIVendorService{
    static okRes(data:any,message:string='OK',status:number=1){
        return {status,message,data};
    }
    static errRes(data:any,message:string='Error',status:number=0){
        return {status,message,data};
    }
    static createToken(data:VendorModel){
        try {
            return jwt.sign({
                data,
              }, Keys.jwtKey, { expiresIn: '5m'});
        } catch (error) {
            console.log(error);
            
            return '';
        }
      return '';
    }
    static validateToken(k:string){
        try {
            const data = jwt.verify(k,Keys.jwtKey) as VendorModel;
            const token = APIVendorService.createToken(data);
            if(token) return token;
            else return '';
        } catch (error) {
            console.log(error);
            return '';
        }
    }
    static checkMySelf(k: string, req: Request) {
        try {
            const o = jwt.decode(k);
            if (o) {
                const data = o['data'] as VendorModel;
                const user = req.headers['_user'] as unknown as VendorModel;
                const vendor_id = req.body.vendor_id;
                if (user.vendor_id === data.vendor_id && user.vendor_id === vendor_id && user.vendor_id && data.vendor_id && vendor_id) {
                    return true;
                } else {
                    return false;
                }
            }
            return false;
        } catch (error) {
            console.log(error);
        }
        return false;
    }
    static vatlidateSuperAdmin(k:string){
        if(k===Keys.superadminkey)
        return true;
        else return false;
    }
    static clone(data:any){
        return JSON.parse(JSON.stringify(data))
    }
    static getCurrentUser(k: string) {
        try {
            const o = jwt.decode(k);
            console.log(JSON.stringify(o));

            if (o) {
                return o['data'];
            }
        } catch (error) {
            console.log(error);
        }
        return null;
    }
    
}
enum Keys{
      jwtKey='Dx4YsbptOGuHmL94qdC2YAPqsUFpzJkc' ,
      superadminkey = '9F58A83B7628211D6E739976A3E3A'
}