const Contact = require("../models/Contact");
const ContactNotFoundException = require("../exceptions/ContactNotFoundException");
const PhoneAlreadyExistsException = require("../exceptions/PhoneAlreadyExistsException");
const {getUserById} = require("./authService");

async function createNewContact(contactRequest) {
    const firstname = contactRequest.firstname;
    const lastname = contactRequest.lastname;
    const phoneNumber = contactRequest.phoneNumber;
    const userId = contactRequest.userId;

    const contact = await Contact.findOne( { where: { phoneNumber: phoneNumber } } );
    if (contact) {
        throw new PhoneAlreadyExistsException('You already have this phone number saved!');
    }

    const savedContact = await Contact.create(
        {
            firstname: firstname,
            lastname: lastname,
            phoneNumber: phoneNumber
        }
    );
    const contactOwner = getUserById(userId);
    savedContact.setUser(contactOwner);
    return savedContact;
}


async function findAllContactsForAUser() {

}

async function retrieveASingleContact(contactId) {

}

async function updateAContact(ownerEmail, otp) {
    await VerificationOtp.create({
        ownerEmail: ownerEmail,
        otp: otp,
    });
}

async function deleteAContact(contactId) {
    await VerificationOtp.create({
        ownerEmail: ownerEmail,
        otp: otp,
    });
}

module.exports = {
    createNewContact,
    findAllContactsForAUser,
    retrieveASingleContact,
    updateAContact,
    deleteAContact
}
