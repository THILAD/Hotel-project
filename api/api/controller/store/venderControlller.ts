import { Request, Response, NextFunction, Application, response } from "express";
import { Sequelize } from "sequelize/types";
import { DatabaseVendor, Login,  } from "../../../Model/vendor.model";
import { APIService } from "../../../services/api.service";
import { dbconnection, UserEntity } from "../../entities/index";
import { DatabaseModel } from "../../entities/vendorEntity";
import { API_VendorService } from "../../service/api.services.vendor";
import { ApiUserRes } from "../../service/reqeust/createUserVendor";

export class VendorController {
    app: Application;
    dbconnection: Sequelize;
    constructor(app: Application) {
        this.app = app;
        // sync
        // UserEntity.sync();
        //USERLIST
        app.get('', VendorController.getserverrunning)
        app.get('/api/vendor', VendorController.getVendorList)
        app.post('/api/vendor', VendorController.GetVendorDetails)
        // .patch('/vendor/update', VendorController.UpdateVendor)
        app.put('/api/vendor', VendorController.CresateVendorUser)

    }

    static getserverrunning(req: Request, res: Response) {
        res.send('server runing ')
    }
    // get all user list passed thonthilad
    static getVendorList(req: Request, res: Response) {

        try {
            const limit = req.query.limit ? Number(req.query.limit) : 10;
            const skip = req.query.limit ? Number(req.query.limit) : 0;
            UserEntity.findAll({ limit, offset: skip * limit }).then(r => {
                const data = r as unknown 
                // res.send(ApiUserRes.successRegister(r))
                const successResponse = {
                 
                    command: "vendorList",
                    messages: 'vendorList successfully',
                    status: 1,
                    userVendor: data
                };
                res.send(successResponse);
                return response.status(200).send(successResponse)
            })
        } catch (error) {
            const successResponse = {
               
                command: "vendorList",
                messages: 'something wrong',
                status: 0,
                userVendor: error
            };
            res.send(error)
            return response.status(404).send(error)

        }
    }

    // get user detail by id
    static GetVendorDetails(req: Request, res: Response) {
        const data= req.body as DatabaseModel
        console.log('tets------------------tes---',data);
        console.log('tets------------------tes---',data.vendor_id);

        
        try {
            const header = req.header
            const vendor_id: number = req.body.vendor_id;
            console.log('----------test do you know id--------------',vendor_id);
            
            UserEntity.findByPk(vendor_id).then(r => {
                const data = r as  DatabaseModel
                const successResponse= {
                    messages: 'vendorDetail successfully',
                    status: 1,
                    userVendor: data
                };
                console.log('-----------seucces------------',data.vendor_phonenumber);
                
                if (data) {
                    const u = API_VendorService.clone(data) as DatabaseModel;
                    
                    delete u.vendor_password;
                    return res.send(successResponse);
                } else {
                    const errorResponse= {
                        messages: 'vendorDetail somthing wrong',
                        status:0,
                        userVendor: data
                    };
                    res.send(({errorResponse}));
                }
                // const token = APIService.requestToken(req);
            }).catch(error => {
                const errorRes = {
                    code: 0,
                    command: "vendorDetail",
                    messages: 'something wrong',
                    status: "failed",
                    userVendor: error
                };
                res.send(errorRes);
            })
        } catch (error) {
            const errorRes = {
                code: 0,
                command: "vendorDetail",
                messages: 'something wrong',
                status: "failed",
                userVendor: error
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
                }).then(async r => {
                    // console.log(r, 'You already have phone number');
                    if (r) {
                        await transaction.rollback();
                        const errorRes= {
                            code: 3,
                            command: "vendorRegister",
                            messages: 'You already have phone number',
                            status: "failed",
                            userVendor: r
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
                                code: 1,
                                command: "vendorRegister",
                                messages: 'vendorRegister successfully',
                                status: "success",
                                userVendor: resData
                            };
                            console.log('------ress=------',resData);
                            
                            res.send(successResponse);
                        }).catch(e => {
                            const errorRes= {
                                code: 3,
                                command: "vendorRegister",
                                messages: 'somthing went wrong',
                                status: "failed",
                                userVendor: e
                            };
                            console.log('eorrrrorror',e);
                            
                            res.send(errorRes);
                        })
                    }
                })
            });
        } catch (error) {
            const errorRes = {
                code: 3,
                command: "vendorDetail",
                messages: 'somthing went wrong',
                status: "failed",
                userVendor: error
            };
            console.log('eorrrrorror',error);

            res.send(errorRes);
        }
        const transaction = await dbconnection.transaction();
    }

    //update user
    static UpdateVendor(req: Request, res: Response) {

        try {
            const id = req.body.id + '';
            const users = req.body as DatabaseVendor;
            UserEntity.findByPk(id).then(async r => {
                console.log('okokookooko', r);
                if (r) {
                    r['vendor_role'] = users.vendor_role,
                        r['vendor_name'] = users.vendor_name,
                        r['vendor_phonenumber'] = users.vendor_phonenumber
                    r['vendor_password'] = users.vendor_password,
                        res.send({
                            status: 1,
                            data: await r.save(),
                            message: 'update OK'

                        });

                    const successResponse={
                        code: 1,
                        command: "vendorRegister",
                        messages: 'update user successfully',
                        status: "success",
                        userVendor: r
                    };
                    res.send(successResponse);
                }
            }).catch(e => {
                const errorRes = {
                    code: 3,
                    command: "vendorRegister",
                    messages: 'somthing went wrong',
                    status: "failed",
                    userVendor: e
                };
                res.send(errorRes);
                console.log('eorror data ', e);
            });
        } catch (e) {
            const errorRes = {
                code: 3,
                command: "vendorRegister",
                messages: 'somthing went wrong',
                status: "failed",
                userVendor: e
            };
            res.send(errorRes);
            console.log('eorror data ', e);
        }
    }
    static DeleteVendor(req: Request, res: Response) {
        let id = req.body.id + '';
        UserEntity.findByPk(id).then(async r => {
            let x = r.destroy();

            const successResponse = {
                code: 3,
                command: "vendorRegister",
                messages: 'delete successful',
                status: "success",
                userVendor: r
            };
            res.send(successResponse)
        }).catch(e => {
            const errorRes = {
                code: 3,
                command: "vendorRegister",
                messages: 'somthing went wrong',
                status: "failed",
                userVendor: e
            };
            res.send(errorRes)

        })
    }

}
