const { DataTypes } = require("sequelize");
const { sq } = require("../utils/database");

const User = sq.define('Users', {
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
        paranoid: true
    }
);


sq.sync()
    .then(() => {
        console.log('User model synced with the database');
    })
    .catch((error) => {
        console.error('Error syncing User model:', error);
    });

module.exports = User;
