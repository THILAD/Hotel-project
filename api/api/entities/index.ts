import {  Sequelize} from "sequelize";
import { vendorFactory } from "./vendorEntity";
import {  customerFactory } from "./customerEntity";
export const dbconnection = new Sequelize('test2','root','',{
    host:'localhost',
    dialect:'mysql'
});
//data base  name customeruser
export enum EntityVendorPrifix{
    vendor_user='vendor',
    Messages='vendor database'
}
export enum EntitycustomerPrifix{
    Customer_user='customer',
    Messages='customer database'
}

// create data base
export const UserEntity= vendorFactory(EntityVendorPrifix.vendor_user,dbconnection);
export const CustomerEntity= customerFactory(EntitycustomerPrifix.Customer_user,dbconnection);


// init database
export function initDB():Promise<Sequelize>{
    return new Promise<Sequelize>(async (resolve,reject)=>{
        try {
         await UserEntity.sync();
         await CustomerEntity.sync();

    //  To do this
         resolve(dbconnection)
        } catch (error) {
            reject(error);
        }
    
    });
     
 }