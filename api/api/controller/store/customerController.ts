import { Request, Response, NextFunction, Application, response } from "express";
import { Sequelize, Transaction } from "sequelize/types";
import { CustomerModel } from "../../../Model/customer.model";
import { APIcustomerService } from "../../../services/customer.service";
import { CustomerEntity, dbconnection } from "../../entities/index";
import { AuthCustomerCheckLogin } from "../auth/customer-auth";
export class CustomerController {
    app: Application;
    dbconnection: Sequelize;
    constructor(app: Application) {
        this.app = app;
        app.get('/api/customer/getall',AuthCustomerCheckLogin.checkToken, CustomerController.GetAllUser)  //passed get all user
        app.get('/api/customer/getbyid',AuthCustomerCheckLogin.checkToken, CustomerController.GetCustomerById)  //passed get a user
        app.put('/api/customer/create',CustomerController.CreateCustomer)  //passed createuser
        app.patch('/api/customer/update', CustomerController.UpdateCustomer)  //passed updatel user
        app.delete('/api/customer/delete', CustomerController.DeleteCustomer)  //passed updatel user
        app.patch('/api/customer/updaterole', CustomerController.UpdateRole)  //passed updatel user
    }

    static GetAllUser(req: Request, res: Response) {
        try {
            const limit = req.query.limit ? Number(req.query.limit) : 10;
            const skip = req.query.limit ? Number(req.query.limit) : 0;
            CustomerEntity.findAll({ limit, offset: limit * skip }).then
                (r => {
                    const result = r as unknown as CustomerModel
                    const resSuccess = {
                        status: 1,
                        mesages: "get all customer successfully",
                        data: result
                    }
                    console.log(resSuccess);

                    res.send(result)
                    return response.status(200).send((resSuccess))
                })

        } catch (error) {
            console.log('get all errror', error);
            const errorRes = {
                status: 0,
                mesages: "something weny wrong",
                data: error
            }
            res.send(errorRes)
            response.status(404).send(errorRes)
        }
    }
    static GetCustomerById(req: Request, res: Response) {
        const c_id = req.body as CustomerModel
        console.log('========c_id======', c_id);

        try {
            const header = req.header
            const c_id = req.body.c_id
            CustomerEntity.findByPk(c_id).then
                (r => {
                  

                    // delete some parameter dont show
                    if (r) {
                        const setData = APIcustomerService.clone(r) as CustomerModel
                        delete setData.c_role
                        delete setData.c_password
                        const successRes = {
                            status: 1,
                            mesages: "get cuctomer by id successfully",
                            data: setData
                        }
                        res.send(successRes)
                        response.status(200).send(successRes)
                    } else{
                        const errorRes={
                            status:0,
                            messages:"something went wrong",
                            data:r
                        }
                        res.send(errorRes)
                        response.status(404).send(errorRes)
                    }
                 
                })
        } catch (error) {
            const errorRes = {
                status: 1,
                mesages: "something went wrong",
                data: error
            }
            res.send(errorRes)
            response.status(404).send(errorRes)
        }
    }
    static CreateCustomer(req:Request, res:Response){
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
    static UpdateCustomer(req:Request,res:Response){
        const data=req.body as CustomerModel
console.log(data);

        try {
            const my_id=data.c_id
            CustomerEntity.findByPk(my_id).then
            (async r=>{
                console.log('rrrrr',r);
               if(r){
                r['c_role'] = data.c_role,
                r['c_name'] = data.c_name,
                r['c_name'] = data.c_phonenumber
                r['c_name'] = data.c_password,
               
                
                res.send({
                    status: 1,
                    messages: 'update user successfully',
                    data: await r.save(),
                });
               }else{
                res.send({ status: 0, data: [], message: 'update failed' });
               }
            })
        } catch (error) {
            
            res.send({ status: 0, data: error, message: 'update failed' });
        }
    }
    static DeleteCustomer(req:Request,res:Response){
        try {
            const c_id= req.body.c_id
  CustomerEntity.findByPk(c_id).then
  (r=>{
      let x=r.destroy()
      const successResponse = {
        messages: 'delete successful',
        status: 1,
        data: x

    };
    res.send(successResponse)
    response.status(200).send(successResponse)

  })
        } catch (error) {
            const errorRes = {
                messages: 'somthing went wrong',
                status: 0,
                data: error
            };
            res.send(errorRes)
            response.status(404).send(errorRes)
        }
    }
    static  UpdateRole(req:Request,res:Response){
        const data=req.body as CustomerModel

        try {
            const my_id=data.c_id
            CustomerEntity.findByPk(my_id).then
            (async r=>{
               if(r){
                r['c_role'] = data.c_role,
                res.send({
                    status: 1,
                    messages: 'update user successfully',
                    data: await r.save(),
                });
               }else{
                res.send({ status: 0, data: [], message: 'update failed' });
               }
            })
        } catch (error) {
            
            res.send({ status: 0, data: error, message: 'update failed' });
        }
    }
}