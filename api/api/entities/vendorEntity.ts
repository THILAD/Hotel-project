import { DataType, BuildOptions, DATE, Model, ModelAttributes, Sequelize, DataTypes } from "sequelize";
import * as bcryptjs from 'bcryptjs';
import { request } from "express";
import { DatabaseVendor } from "../../Model/vendor.model";

export interface  vendorAttributes extends DatabaseVendor {
    // role: string;
}
//model
export interface  DatabaseModel extends Model<vendorAttributes>, vendorAttributes {
    prototype: {
        validPassword: (vendorPassword: string) => boolean;
        hashPassword: (vendorPassword: string) => boolean;
    };
    
}
//object
export class vendorObject extends Model<DatabaseModel, vendorAttributes>{
    prototype: {
        validPassword: (vendorPassword: string) => boolean;
        hashPassword: (vendorPassword: string) => string;
    } | undefined;
}
// static object
export type VendorStatic = typeof Model & {
    new(values?: object, options?: BuildOptions): DatabaseModel;
}

//entity factory
export const vendorFactory = (name: string, sequelize: Sequelize): VendorStatic => {
    const attributes: ModelAttributes<DatabaseModel> = {
        vendor_id: { 
            type: DataTypes.INTEGER,
            primaryKey: true,
            unique: true,
            autoIncrement: true,
            autoIncrementIdentity: true,
            allowNull: false
        },
        // vendor_role: {
            
        //     type: DataTypes.STRING,
        // },
        vendor_name: {
            type: DataTypes.STRING
        },
        vendor_phonenumber: {
            type: DataTypes.STRING
        },
        vendor_password: {
            type: DataTypes.STRING
        },
        vendor_card_id: {
            type: DataTypes.STRING,
        },
        vendor_photo: {
            type: DataTypes.STRING,
        },
        vendor_photo_path: {
            type: DataTypes.STRING,
        },
        vendor_address1: {
            type: DataTypes.STRING,
        },
        vendor_address2: {
            type: DataTypes.STRING,
        },
        CreateAt: {
            type: DataTypes.STRING, defaultValue: new Date().toJSON()
        },
        UpdateAt: {
            type: DataTypes.STRING, defaultValue: new Date().toJSON()
        },
        isActive: {
            type: DataTypes.BOOLEAN, defaultValue: true
        },
        last_login: {
            type: DataTypes.STRING, defaultValue: new Date().toJSON()
        },
       
    } as ModelAttributes<DatabaseModel>;

    let x = sequelize.define(name, attributes, { tableName: name, freezeTableName: true });

    x.prototype.hashPassword = function (password: string): string {
        if (!password) return '';
        return this.password = bcryptjs.hashSync(password, bcryptjs.genSaltSync())
    }
    x.prototype.validPassword = function (password: string): boolean {
        const str = password + this.vendor_username + this.vendor_phonenumber;
        console.log('valid password', str, "length", str.length);
        console.log('valid password', this.vendor_password);
        if (bcryptjs.compareSync(str, this.vendor_password)) return true;
        return false;
    }
    x.beforeCreate(async (user, options) => {
        if (user.changed('vendor_password')) {
            if (user.vendor_password && user.vendor_name && user.vendor_phonenumber) {
                const str = user.vendor_password + user.vendor_name + user.vendor_phonenumber;
                console.log('create password', str, "length", str.length);
                return bcryptjs.hash(str, bcryptjs.genSaltSync())
                    .then(hash => {
                        console.log('has', hash);
                        user.vendor_password = hash;
                    })
                    .catch(Error => {
                        throw new Error(Error);
                    });
            }
        }
    });

    x.beforeUpdate(async (user, option) => {
        if (user.changed('vendor_password')) {
            if (user.vendor_password && user.vendor_name && user.vendor_phonenumber) {
                const str = user.vendor_password + user.vendor_name + user.vendor_phonenumber;
                console.log('update password', str, "length", str.length);
                return bcryptjs.hash(str, bcryptjs.genSaltSync())
                    .then(hash => {
                        user.vendor_password = hash;
                    })
                    .catch(err => {
                        throw new Error(err);
                    });
            }
        }
    });
    return x;
} 