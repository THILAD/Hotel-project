


import { Request, Response, NextFunction, Application,  } from "express";
import { Sequelize } from "sequelize/types";
import { DatabaseVendor, } from "../../../Model/vendor.model";
import { APIVendorService } from "../../../services/vendor.service";
import { dbconnection, UserEntity } from "../../entities/index";
import { VendorModel } from "../../entities/vendorEntity";
import { redisClient } from "../store/index";
export interface ILogin  {
   vendor_password:string,
   vendor_phonenumber:string
}
export class AuthCheckLogin {
    app: Application;
    dbconnection: Sequelize;
    constructor(app: Application) {
        this.app = app;

   
        app.post('/api/vendor/login', AuthCheckLogin.Login)  //passed login user
        app.post('/api/vendor/register', AuthCheckLogin.Registion)  //passed login user


    }
    // redis
    static setRedisToken(t:string,v:string){
        redisClient.set(t,v,'EX', 3*60);
    }
//login
//   static Login(req: Request, res: Response) {
//     const login = req.body as ILogin;
//     console.log('5555555555555555555555555',login);

//     if (login.vendor_phonenumber && login.vendor_password) {
//         UserEntity.findOne({ where: { vendor_phonenumber: login.vendor_phonenumber } }).then(async r  =>  {
//             // console.log('login r', r);
//             if (r) {
// console.log('valid password',r.validPassword);

//                     // delete r.vendor_password;
//                     // delete r.vendor_phonenumber;
//                     if(r.validPassword(login.vendor_password)){
//                         console.log("ttttttttttttttttttttttttttttttttttttt");
//                         const user = APIVendorService.clone(r);
//                         console.log('rrrrrrrrrrrrrrrrrr', r);
//                         delete user.role;
//                         delete user.vendor_password;
//                         delete user.vendor_phonenumber;
//                         const token = APIVendorService.createToken(r as VendorModel);
//                         AuthCheckLogin.setRedisToken(token,token);
//                         //check
//                         res.setHeader('authorization', token);
//                         res.send(APIVendorService.okRes({ r, token }, 'Login OK'));
                   
//                     }else{
//                         const resErr={
//                             status:0,
//                             messages:" password incorect",
//                             token:'',
//                             data:['']
//                         }
//                         res.send(resErr)
//                     }
                  

//             } else {
//                 res.send(APIVendorService.errRes('Username not found'));

//             }
//         }).catch(e => {
//             console.log('error login ', e);

//             res.send(APIVendorService.errRes(e, 'Error login'));
//         })

//     } else {
//         res.send(APIVendorService.errRes('Empty username or password'));
//     }
// }

static Login(req: Request, res: Response) {
        const login = req.body as ILogin;
        console.log('5555555555555555555555555',login);
    
        if (login.vendor_phonenumber && login.vendor_password) {
            UserEntity.findOne({ where: { vendor_phonenumber: login.vendor_phonenumber } }).then(async r  =>  {
                // console.log('login r', r);
                if (r) {
    console.log('valid password',r.validPassword);
    
                        // delete r.vendor_password;
                        // delete r.vendor_phonenumber;
                        if(r.validPassword){
                            const user = APIVendorService.clone(r);
                            console.log('rrrrrrrrrrrrrrrrrr', r);
                            delete user.role;
                            delete user.vendor_password;
                            delete user.vendor_phonenumber;
                            const token = APIVendorService.createToken(r as VendorModel);
                            AuthCheckLogin.setRedisToken(token,token);
                            //check
                            res.setHeader('authorization', token);
                            res.send(APIVendorService.okRes({ r, token }, 'Login OK'));
                       
                        }else{
                            const resErr={
                                status:0,
                                messages:" password incorect",
                                token:'',
                                data:['']
                            }
                            res.send(resErr)
                        }
                } else {
                    res.send(APIVendorService.errRes('Username not found'));
                }
            }).catch(e => {
                console.log('error login ', e);
    
                res.send(APIVendorService.errRes(e, 'Error login'));
            })
    
        } else {
            res.send(APIVendorService.errRes('Empty username or password'));
        }
    }
//resgister
static  Registion(req: Request, res: Response) {

try {
    const user = req.body as DatabaseVendor;
    console.log('===data====',user);
     // check phone number 
    dbconnection.transaction().then(transaction => {
        UserEntity.findOne({
            where:
            {
                vendor_phonenumber: user.vendor_phonenumber
            }, transaction
        }).then(async r => {
            // console.log(r, 'You already have phone number');
            if (r) {
                await transaction.rollback();
                const errorRes= {
               
                    messages: 'You already have phone number',
                    status: 0,
                    data: r
                };
                res.send(errorRes);
            }
            else {
                console.log('else okkkokkopkokokkokokokok');
                 const addData= new DatabaseVendor
             addData.vendor_name=user.vendor_name
             addData.vendor_phonenumber=user.vendor_phonenumber
             addData.vendor_password=user.vendor_password
           console.log('data before sent to serve',addData);

                UserEntity.create<any>(addData).then(resData => {
                    const successResponse = {
                    
                        messages: 'vendorRegister successfully',
                        status: 1,
                        data: resData
                    };
                    console.log('------successResponse=------',successResponse);
                    
                    res.send(successResponse);
                }).catch(e => {
                    const errorRes= {
                        messages: 'somthing went wrong',
                        status: 0,
                        data: e
                    };
                    console.log('eorrrrorror',errorRes);
                    res.send(errorRes);
                })
            }
        })
    });
} catch (error) {
    const errorRes = {
        messages: 'somthing went wrong',
        status: 0,
        data: error
    };
    console.log('eorrrrorror',errorRes);
    res.send(errorRes);
}
const transaction = dbconnection.transaction();
}
static checkToken(req: Request, res: Response, next: NextFunction) {
    const token = req.headers['token'] + '';
   // const _user = 
    /// refreshing
    const newToken = APIVendorService.validateToken(token);
    req.headers['token'] = newToken;
    // req.headers['_user'] = 
    res.setHeader('token', newToken);
    if (newToken) {
       req['_user']=APIVendorService.getCurrentUser(newToken);
       console.log(' MMMMMMMMMMMMMMMMMMMMMMMM ',req['_user']);
        next();
    }
    else {
        res.status(402).send('You have no an authorization!')
    }
}

}
