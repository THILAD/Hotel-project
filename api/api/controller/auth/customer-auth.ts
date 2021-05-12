



import { Request, Response, NextFunction, Application, } from "express";
import { Sequelize } from "sequelize/types";
import { dbconnection, CustomerEntity } from "../../entities/index";
import { customersModel } from "../../entities/customerEntity";
import { CustomerModel } from "../../../Model/customer.model";
import { APIcustomerService } from "../../../services//customer.service";
import { redisClient } from "../store/index";
export interface ILogin {
    c_password: string,
    c_phonenumber: string
}
export class AuthCustomerCheckLogin {
    app: Application;
    dbconnection: Sequelize;
    constructor(app: Application) {
        this.app = app;
        app.post('/api/customer/login', AuthCustomerCheckLogin.Login)  //passed login user
        app.post('/api/customer/register', AuthCustomerCheckLogin.Registion)  //passed login user
    }
    // redis
    static setRedisToken(t: string, v: string) {
        redisClient.set(t, v, 'EX', 3 * 60);
    }
    static Login(req: Request, res: Response) {
        const login = req.body as ILogin;
        console.log('5555555555555555555555555', login);

        if (login.c_phonenumber && login.c_password) {
            CustomerEntity.findOne({ where: { c_phonenumber: login.c_phonenumber } }).then(async r => {
                // console.log('login r', r);
                if (r) {
                    // delete r.c_password;
                    // delete r.c_phonenumber;
                    if (r.validPassword) {
                        const user = APIcustomerService.clone(r);
                        console.log('rrrrrrrrrrrrrrrrrr', r);
                        delete user.role;
                        delete user.c_password;
                        delete user.c_phonenumber;
                        const token = APIcustomerService.createToken(r);
                        AuthCustomerCheckLogin.setRedisToken(token, token);
                        //check
                        res.setHeader('token', token);

                        const resSuccess ={
                         status:1,
                         messages:"Login successfully",
                         data:r,
                         token:token
                        }
                        res.send(resSuccess);

                    } else {
                        const resErr = {
                            status: 0,
                            messages: " password incorect",
                            token: '',
                            data: ['']
                        }
                        res.send(resErr)
                    }
                } else {
                    res.send(APIcustomerService.errRes('Username not found'));
                }
            }).catch(e => {
                console.log('error login ', e);

                res.send(APIcustomerService.errRes(e, 'Error login'));
            })

        } else {
            res.send(APIcustomerService.errRes('Empty username or password'));
        }
    }
    //resgister pass
    static Registion(req: Request, res: Response) {
        try {
            const user = req.body as CustomerModel;
            console.log('===data====', user);
            // check phone number 
            dbconnection.transaction().then(transaction => {
                CustomerEntity.findOne({
                    where:
                    {
                        c_phonenumber: user.c_phonenumber
                    }, transaction
                }).then(async r => {
                    // console.log(r, 'You already have phone number');
                    if (r) {
                        await transaction.rollback();
                        const errorRes = {
                            messages: 'You already have phone number',
                            status: 0,
                            data: r
                        };
                        res.send(errorRes);
                    }
                    else {
                        const addData = new CustomerModel
                            addData.c_name = user.c_name,
                            addData.c_phonenumber = user.c_phonenumber,
                            addData.c_password = user.c_password
                        console.log('data before sent to serve', addData);
                        CustomerEntity.create<any>(addData).then(resData => {
                            const successResponse = {
                                messages: 'Register successfully',
                                status: 1,
                                data: resData
                            };
                            console.log('------successResponse=------', successResponse);
                            res.send(successResponse);
                        }).catch(e => {
                            const errorRes = {
                                messages: 'somthing went wrong',
                                status: 0,
                                data: e
                            };
                            console.log('eorrrrorror', errorRes);
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
            console.log('eorrrrorror', errorRes);
            res.send(errorRes);
        }
        const transaction = dbconnection.transaction();
    }
    static checkToken(req: Request, res: Response, next: NextFunction) {
        const token = req.headers['token'] + '';
        /// refreshing
        const newToken = APIcustomerService.validateToken(token);
        req.headers['token'] = newToken;
        res.setHeader('token', newToken);
        if (newToken) {
            req['_user'] = APIcustomerService.getCurrentUser(newToken);
            console.log(' MMMMMMMMMMMMMMMMMMMMMMMM ', req['_user']);
            next();
        }
        else {
            res.status(402).send('You have no an authorization!')
        }
    }

}