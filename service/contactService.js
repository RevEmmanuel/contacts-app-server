const ContactNotFoundException = require("../exceptions/ContactNotFoundException");
const PhoneAlreadyExistsException = require("../exceptions/PhoneAlreadyExistsException");
const {sq} = require("../utils/database");
const Contact = require("../models/Contact")
const User = require("../models/User");

async function createNewContact(contactRequest) {
    const firstname = contactRequest.firstname;
    const lastname = contactRequest.lastname;
    const phoneNumber = contactRequest.phoneNumber;
    const userId = contactRequest.userId;
    const phoneNumberPattern = '^(\\+234|234|0)(701|702|703|704|705|706|707|708|709|802|803|804|805|806|807|808|809|810|811|812|813|814|815|816|817|818|819|909|908|901|902|903|904|905|906|907)([0-9]{7})$'
    const contact = await sq.models.Contact.findOne( { where: { phoneNumber: phoneNumber, userId: userId } } );
    if (contact) {
        throw new PhoneAlreadyExistsException('You already have this phone number saved!');
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
    return await sq.models.Contact.findAndCountAll({
        where: {
            userId: userId,
        },
    });
}

async function retrieveASingleContact(contactId, userId) {
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

    const contact = await sq.models.Contact.findOne( { where: { phoneNumber: updateContactRequest.phoneNumber, userId: userId } } );
    if (contact) {
        throw new PhoneAlreadyExistsException('You already have this phone number saved!');
    }

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
