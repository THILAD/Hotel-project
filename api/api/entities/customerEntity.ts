import { DataType, BuildOptions, DATE, Model, ModelAttributes, Sequelize, DataTypes } from "sequelize";
import * as bcryptjs from 'bcryptjs';
import { CustomerModel} from "../../Model/customer.model";



export interface  CustomerAttributes extends CustomerModel {
    // role: string;
} 
//model
export interface  customersModel extends Model<CustomerAttributes>, CustomerAttributes {
    prototype: {
        validPassword: (c_Password: string) => boolean;
        hashPassword: (c_Password: string) => boolean;
    };
    
}

//object
export class CustomerObject extends Model<customersModel, CustomerAttributes>{
    prototype: {
        validPassword: (c_Password: string) => boolean;
        hashPassword: (c_Password: string) => string;
    } | undefined;
}

// static object
export type CustomrtStatic = typeof Model & {
    new(values?: object, options?: BuildOptions): customersModel;
}

//entity factory
export const customerFactory = (name: string, sequelize: Sequelize): CustomrtStatic => {
    const attributes: ModelAttributes<customersModel> = {
        c_id: { 
            type: DataTypes.INTEGER,
            primaryKey: true,
            unique: true,
            autoIncrement: true,
            autoIncrementIdentity: true,
            allowNull: false
        },
        c_role: {
            type: DataTypes.STRING
        },
        c_name: {
            type: DataTypes.STRING
        },
       
        c_phonenumber: {
            type: DataTypes.STRING
        },
       c_password: {
            type: DataTypes.STRING
        },
        c_card_id: {
            type: DataTypes.STRING,
        },
       c_avatar_path: {
            type: DataTypes.STRING,
        },
        c_avatar: {
            type: DataTypes.STRING,
        },
        c_address1: {
            type: DataTypes.STRING,
        },
       c_address2: {
            type: DataTypes.STRING,
        },
    } as ModelAttributes<customersModel>;

    let x = sequelize.define(name, attributes, { tableName: name, freezeTableName: true });

    x.prototype.hashPassword = function (c_password: string): string {
        if (!c_password) return '';
        return this.c_password = bcryptjs.hashSync(c_password, bcryptjs.genSaltSync())
    }
    x.prototype.validPassword = function (c_password: string): boolean {
        const str = c_password + this.c_name + this.c_phonenumber;
        console.log('valid password', str, "length", str.length);
        console.log('valid password', this.c_password);
        if (bcryptjs.compareSync(str, this.c_password)) return true;
        return false;
    }
    x.beforeCreate(async (user, options) => {
        if (user.changed('c_password')) {
            if (user.c_password && user.c_name&& user.c_phonenumber) {
                const str = user.c_password + user.c_name + user.c_phonenumber;
                console.log('create password', str, "length", str.length);
                return bcryptjs.hash(str, bcryptjs.genSaltSync())
                    .then(hash => {
                        console.log('has', hash);
                        user.c_password = hash;
                    })
                    .catch(Error => {
                        throw new Error(Error);
                    });
            }
        }
    });

    x.beforeUpdate(async (user, option) => {
        if (user.changed('c_password')) {
            if (user.c_password && user.c_name && user.c_phonenumber) {
                const str = user.c_password + user.c_name + user.c_phonenumber;
                console.log('update password', str, "length", str.length);
                return bcryptjs.hash(str, bcryptjs.genSaltSync())
                    .then(hash => {
                        user.c_password = hash;
                    })
                    .catch(err => {
                        throw new Error(err);
                    });
            }
        }
    });
    return x;
} 