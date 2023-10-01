const ContactNotFoundException = require("../exceptions/ContactNotFoundException");
const PhoneAlreadyExistsException = require("../exceptions/PhoneAlreadyExistsException");
const {sq} = require("../utils/database");
const Contact = require("../models/Contact")
const User = require("../models/User");
const {checkIfUserExists} = require("./authService");
const UserNotFoundException = require("../exceptions/UserNotFoundException");

async function createNewContact(contactRequest) {
    const firstname = contactRequest.firstname;
    const lastname = contactRequest.lastname;
    const phoneNumber = contactRequest.phoneNumber;
    const userId = contactRequest.userId;
    const contact = await sq.models.Contact.findOne( { where: { phoneNumber: phoneNumber, userId: userId } } );
    if (contact) {
        throw new PhoneAlreadyExistsException('You already have this phone number saved!');
    }

    const userExists = await checkIfUserExists(userId);
    if (!userExists) {
        throw new UserNotFoundException('User does not exist!');
    }

    return await sq.models.Contact.create(
        {
            firstname: firstname,
            lastname: lastname,
            phoneNumber: phoneNumber,
            userId: userId
        }
    );
}


async function findAllContactsForAUser(userId) {
    const userExists = await checkIfUserExists(userId);
    if (!userExists) {
        throw new UserNotFoundException('User does not exist!');
    }
    return await sq.models.Contact.findAndCountAll({
        where: {
            userId: userId,
        },
    });
}

async function retrieveASingleContact(contactId, userId) {
    const userExists = await checkIfUserExists(userId);
    if (!userExists) {
        throw new UserNotFoundException('User does not exist!');
    }
    const contact = await sq.models.Contact.findOne({
        where: {
            id: contactId,
            userId: userId,
        },
    });
    if (!contact) {
        throw new ContactNotFoundException("Contact not found!");
    }
    return contact;
}

async function updateAContact(updateContactRequest, userId) {
    const contactId = updateContactRequest.id;
    const foundContact = await retrieveASingleContact(contactId, userId);
    foundContact.firstname = updateContactRequest.firstname;
    foundContact.lastname = updateContactRequest.lastname;

    foundContact.phoneNumber = updateContactRequest.phoneNumber;
    foundContact.save();
    return foundContact;
}

async function deleteAContact(contactId, userId) {
    const foundContact = await retrieveASingleContact(contactId, userId);
    foundContact.destroy();
    return "SUCCESSFUL";
}

module.exports = {
    createNewContact,
    findAllContactsForAUser,
    retrieveASingleContact,
    updateAContact,
    deleteAContact
}
