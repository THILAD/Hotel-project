
import { dbconnection,initDB } from "../../entities";
import { Application } from "express";

import { VendorController } from './venderControlller';

import  redis from "redis";
export const redisClient = redis.createClient();
export function Init(app: Application) {
        initDB().then(r=>{
            // console.log('connection to sql', r);
             new VendorController(app);// routing
        }).catch(e=>{
            console.log(e);
            
        })
    
}
