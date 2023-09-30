const ContactNotFoundException = require("../exceptions/ContactNotFoundException");
const PhoneAlreadyExistsException = require("../exceptions/PhoneAlreadyExistsException");
const {sq} = require("../utils/database");

async function createNewContact(contactRequest) {
    const firstname = contactRequest.firstname;
    const lastname = contactRequest.lastname;
    const phoneNumber = contactRequest.phoneNumber;
    const userId = contactRequest.userId;

    console.log(sq.models);
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
    console.log("userId", userId);
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
    const foundContact = retrieveASingleContact(contactId, userId);
    foundContact.firstname = updateContactRequest.firstname;
    foundContact.lastname = updateContactRequest.lastname;
    foundContact.phoneNumber = updateContactRequest.phoneNumber;
    foundContact.save();
    return foundContact;
}

async function deleteAContact(contactId, userId) {
    const foundContact = retrieveASingleContact(contactId, userId);
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
