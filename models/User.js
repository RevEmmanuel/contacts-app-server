"use strict";
const { Model, DataTypes } = require("sequelize");
const {sq} = require("../utils/database");
const Contact = require("./Contact")

class User extends Model {
}

User.init(
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            unique: true
        },
        username: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
            validate: {
                isEmail: true,
            },
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        isVerified: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false,
        },
        createdAt: {
            type: DataTypes.DATE,
            defaultValue: sq.literal('CURRENT_TIMESTAMP'),
        },
        updatedAt: {
            type: DataTypes.DATE,
            defaultValue: sq.literal('CURRENT_TIMESTAMP'),
        },
    },
    {
        sequelize: sq,
        modelName: "Users",
        paranoid: true
    }
);

User.hasMany(Contact, { onDelete: "cascade", foreignKey: "userId" });
Contact.belongsTo(User, { as: "user" })
module.exports = User;