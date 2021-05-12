import { Request, Response, NextFunction, Application, response } from "express";
import { Sequelize } from "sequelize/types";
import { DatabaseVendor, } from "../../../Model/vendor.model";
import { dbconnection, UserEntity } from "../../entities/index";
import { VendorModel } from "../../entities/vendorEntity";
import { APIVendorService } from "../../../services/vendor.service";
import { AuthCheckLogin } from "../auth/vendor-auth";
// import { ApiUserRes } from "../../service/reqeust/createdata";

export class VendorController {
    app: Application;
    dbconnection: Sequelize;
    constructor(app: Application) {
        this.app = app;
        app.get('', VendorController.getserverrunning) // passed 
        app.put('/api/vendor', VendorController.CresateVendorUser)  //passed create user
        app.get('/api/vendor', VendorController.getVendorList) //passed list all u ser
        app.post('/api/vendor', AuthCheckLogin.checkToken, VendorController.GetVendorDetails) //passed get user by id 
        app.patch('/api/vendor', VendorController.UpdateVendor) //passed update user 
        app.delete('/api/vendor', VendorController.DeleteVendor)  //passed delete user 
    }

    static getserverrunning(req: Request, res: Response) {
        res.send('server runing  ')
    }
    // get all user list passed thonthilad
    static getVendorList(req: Request, res: Response) {
        try {
            const limit = req.query.limit ? Number(req.query.limit) : 10;
            const skip = req.query.limit ? Number(req.query.limit) : 0;
            UserEntity.findAll({ limit, offset: skip * limit }).then(r => {
                const data = r 
                const successResponse = {
                 
                    command: "vendorList",
                    messages: 'vendorList successfully',
                    status: 1,
                    data: data
                };
                res.send(successResponse);
                return response.status(200).send(successResponse)
            })
        } catch (error) {
            const successResponse = {
               
                command: "vendorList",
                messages: 'something wrong',
                status: 0,
                data: error
            };
            res.send(successResponse)
            return response.status(404).send(successResponse)

        }
    }

    // get user detail by id
    static GetVendorDetails(req: Request, res: Response) {
        const data= req.body as VendorModel
        console.log('tets------------------tes---',data);
        console.log('tets------------------tes---',data.vendor_id);

        
        try {
            const header = req.header
            const vendor_id: number = req.body.vendor_id;
            console.log('----------test do you know id--------------',vendor_id);
            
            UserEntity.findByPk(vendor_id).then(r => {
                const data = r as  VendorModel
                const successResponse= {
                    messages: 'vendorDetail successfully',
                    status: 1,
                    data: data
                };
                console.log('-----------seucces------------',data.vendor_phonenumber);
                
                if (data) {
                    const u = APIVendorService.clone(data) as VendorModel;
                    delete u.vendor_password;
                    return res.send(successResponse);
                } else {
                    const errorResponse= {
                        messages: 'vendorDetail somthing wrong',
                        status:0,
                        data: data
                    };
                    res.send(({errorResponse}));
                }
                // const token = APIService.requestToken(req);
            }).catch(error => {
                const errorRes = {
                  
                    messages: 'something wrong',
                    status: 0,
                    data: error
                };
                res.send(errorRes);
            })
        } catch (error) {
            const errorRes = {
              
                messages: 'something wrong',
                status: 0,
                data: error
            };
            res.send(errorRes);
        }
    }

    // Create Vendor user passed
    static async CresateVendorUser(req: Request, res: Response) {

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
                }).then
                (async r => {
                    // console.log(r, 'You already have phone number');
                    if (r) {
                        await transaction.rollback();
                        const errorRes= {
                       
                            messages: 'You already have phone number',
                            status: 3,
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
                            console.log('------ress=------',resData);
                            
                            res.send(successResponse);
                        }).catch(e => {
                            const errorRes= {
                             
                                messages: 'somthing went wrong',
                                status: 0,
                                data: e
                            };
                            console.log('eorrrrorror',e);
                            
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
            console.log('eorrrrorror',error);

            res.send(errorRes);
        }
        const transaction = await dbconnection.transaction();
    }

    //update user
    static UpdateVendor(req: Request, res: Response) {
        const data= req.body as VendorModel
        console.log('tets------------------allll---',data);
        console.log('tets------------------data comming id--',data.vendor_id);

        try {
            const id = req.body.vendor_id + '';
            const users = req.body as DatabaseVendor;
            console.log('--------------id----------------',id);
            console.log('--------------data----------------',users);

            
            UserEntity.findByPk(id).then(async r => {
                console.log('okokookooko', r);
                if (r) {
                        r['vendor_name'] = users.vendor_name,
                        r['vendor_phonenumber'] = users.vendor_phonenumber
                        r['vendor_password'] = users.vendor_password,
                        res.send({
                            status: 1,
                            data: await r.save(),
                            messages: 'update user successfully',


                        });

                    // const successResponse={
                    //     messages: 'update user successfully',
                    //     status: 1,
                    //     data: await r.save(),
                    // };
                    // res.send(successResponse);
                }
            }).catch(e => {
                const errorRes = {
                    messages: 'somthing went wrong',
                    status: 0,
                    data: e
                };
                res.send(errorRes);
                console.log('eorror data ', e);
            });
        } catch (e) {
            const errorRes = {
                messages: 'somthing went wrong',
                status: 0,
                data: e
            };
            res.send(errorRes);
            console.log('eorror data ', e);
        }
    }
    static DeleteVendor(req: Request, res: Response) {
        let id = req.body.vendor_id;
        console.log('=================id-------------',id);
        
        UserEntity.findByPk(id).then(async r => {
            let x = r.destroy();
            const successResponse = {
                messages: 'delete successful',
                status: 1,
                data: r
            };
            res.send(successResponse)
        }).catch(e => {
            const errorRes = {
                messages: 'somthing went wrong',
                status: 0,
                data: e
            };
            res.send(errorRes)

        })
    }


}
