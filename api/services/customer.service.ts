//import * as jwt from 'jsonwebtoken';
const jwt = require('jsonwebtoken');
import { customersModel } from '../api/entities/customerEntity';
export class APIcustomerService{
    static okRes(data:any,message:string='successfully',status:number=1){
        return {status,message,data};
    }
    static errRes(data:any,message:string='Error something went wrong',status:number=0){
        return {status,message,data};
    }
    static createToken(data:customersModel){
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
            const data = jwt.verify(k,Keys.jwtKey) as customersModel;
            const token = APIcustomerService.createToken(data);
            if(token) return token;
            else return '';
        } catch (error) {
            console.log(error);
            return '';
        }
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