
import { dbconnection,initDB } from "../../entities";
import { Application } from "express";

import { VendorController } from './venderControlller';
import {AuthCheckLogin  } from "../auth/vendor-auth";
import { AuthCustomerCheckLogin } from "../auth/customer-auth";
import  redis from "redis";
import { CustomerController } from "./customerController";
export const redisClient = redis.createClient();
export function Init(app: Application) {
        initDB().then(r=>{
            // console.log('connection to sql', r);
             new VendorController(app);// routing
             new AuthCheckLogin(app)
             new AuthCustomerCheckLogin(app)
             new CustomerController(app)

        }).catch(e=>{
            console.log(e);
            
        })
    
}
