// //import * as jwt from 'jsonwebtoken';
// const jwt = require('jsonwebtoken');
// import { CustomerUserModel } from '../entities/Entities/customer.user.entity';
// import { Request } from 'express';
// export class APIService{
//     static successRes(data:any,message:string='successfully create da',status:number=1){
//         return {status,message,data};
//     }
//     static errRes(data:any,message:string='Error',status:number=0){
//         return {status,message,data};
//     }
//     static createToken(data:CustomerUserModel){
//         try {
//             return jwt.sign({
//                 data,
//               }, Keys.jwtKey, { expiresIn: '5m'});
//         } catch (error) {
//             console.log(error);
            
//             return '';
//         }
//       return '';
//     }
//     static validateToken(k:string){
//         try {
//             const data = jwt.verify(k,Keys.jwtKey) as CustomerUserModel;
//             const token = APIService.createToken(data);
//             if(token) return token;
//             else return '';
//         } catch (error) {
//             console.log(error);
//             return '';
//         }
//     }
//     static checkMySelf(k: string, req: Request) {
//         try {
//             const o = jwt.decode(k);
//             if (o) {
//                 const data = o['data'] as CustomerUserModel;
//                 const user = req.headers['_user'] as unknown as CustomerUserModel;
//                 const id = req.body.id;
//                 if (user.id === data.id && user.id === id && user.id && data.id && id) {
//                     return true;
//                 } else {
//                     return false;
//                 }
//             }
//             return false;
//         } catch (error) {
//             console.log(error);
//         }
//         return false;
//     }
//     static vatlidateSuperAdmin(k:string){
//         if(k===Keys.superadminkey)
//         return true;
//         else return false;
//     }
//     static clone(data:any){
//         return JSON.parse(JSON.stringify(data))
//     }
    
// }
// enum Keys{
//       jwtKey='Dx4YsbptOGuHmL94qdC2YAPqsUFpzJkc' ,
//       superadminkey = '9F58A83B7628211D6E739976A3E3A'
// }