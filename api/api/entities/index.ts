import {  Sequelize} from "sequelize";
import { vendorFactory } from "./vendorEntity";
export const dbconnection = new Sequelize('test2','root','',{
    host:'localhost',
    dialect:'mysql'
});
//data base  name customeruser
export enum EntityVendorPrifix{
    Customer_user='vendor',
    Messages='vendor database'
}

// create data base
export const UserEntity= vendorFactory(EntityVendorPrifix.Customer_user,dbconnection);

// init database
export function initDB():Promise<Sequelize>{
    return new Promise<Sequelize>(async (resolve,reject)=>{
        try {
         await UserEntity.sync();
    //  To do this
         resolve(dbconnection)
        } catch (error) {
            reject(error);
        }
    
    });
     
 }