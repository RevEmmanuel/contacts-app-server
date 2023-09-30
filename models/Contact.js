const { DataTypes } = require("sequelize");
const { sq } = require("../utils/database");
const User = require("./User");

const Contact = sq.define('Contact', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    firstname: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    lastname: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    phoneNumber: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
    createdAt: {
        type: DataTypes.DATE,
        defaultValue: sq.literal('CURRENT_TIMESTAMP'),
    },
    updatedAt: {
        type: DataTypes.DATE,
        defaultValue: sq.literal('CURRENT_TIMESTAMP'),
    },
});

Contact.belongsTo(User);

sq.sync()
    .then(() => {
        console.log('Contacts model synced with the database');
    })
    .catch((error) => {
        console.error('Error syncing User model:', error);
    });

module.exports = Contact;
