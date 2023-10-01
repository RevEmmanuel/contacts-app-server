const {createNewUser} = require("../service/authService");
const {createNewContact, updateAContact, retrieveASingleContact, deleteAContact} = require("../service/contactService");
const {sq} = require("../utils/database");
const Contact = require("../models/Contact")
const User = require("../models/User");
const VerificationOtp = require("../models/VerificationOtp");
const UserNotFoundException = require("../exceptions/UserNotFoundException");
const PhoneAlreadyExistsException = require("../exceptions/PhoneAlreadyExistsException");
const ContactNotFoundException = require("../exceptions/ContactNotFoundException");

describe("Contacts Service Test", () => {

    beforeAll(async function(){
        await sq.sync( { force: true });
    });
    afterAll(async function(){
        await sq.close();
    });

    describe("Create contact test", () => {
        it('Should create a new contact', async () => {
            const random = getRandomValue();
            const signupDto = {
                email: `test-${random}@example.com`,
                password: 'password',
                username: `Test-User-${random}`
            };
            const res = await createNewUser(signupDto);
            const createContactRequest = {
                firstname: `${random}`,
                lastname: `John ${random}`,
                phoneNumber: '08103078881',
                userId: res.id
            }
            const contact = await createNewContact(createContactRequest)
            expect(contact.firstname).toEqual(createContactRequest.firstname);
            expect(contact.lastname).toEqual(createContactRequest.lastname);
            expect(contact.phoneNumber).toEqual(createContactRequest.phoneNumber);
        });

        it('Should not create a new contact with the same phone number', async () => {
            const random = getRandomValue();
            const signupDto = {
                email: `test-${random}@example.com`,
                password: 'password',
                username: `Test-User-${random}`
            };
            const res = await createNewUser(signupDto);
            const createContactRequest = {
                firstname: `${random}`,
                lastname: `John ${random}`,
                phoneNumber: '08103078881',
                userId: res.id
            }
            await createNewContact(createContactRequest); // creates contact the first time
            expect.assertions(3);
            try {
                await createNewContact(createContactRequest)
            } catch (error) {
                expect(error).toBeInstanceOf(PhoneAlreadyExistsException);
                expect(error.message).toBe('You already have this phone number saved!');
                expect(error.statusCode).toBe(400);
            }
        });

        it('Should not create a contact without a valid user', async () => {
            const random = getRandomValue();
            const signupDto = {
                email: `test-${random}@example.com`,
                password: 'password',
                username: `Test-User-${random}`
            };
            const res = await createNewUser(signupDto);
            const createContactRequest = {
                firstname: `${random}`,
                lastname: `John ${random}`,
                phoneNumber: '08103078881',
                userId: res.id
            }
            createContactRequest.userId = 210;
            try {
                await createNewContact(createContactRequest)
            } catch (error) {
                expect(error).toBeInstanceOf(UserNotFoundException);
                expect(error.message).toBe('User does not exist!');
                expect(error.statusCode).toBe(404);
            }
        });

    });


    describe("Update Contact",  () => {
        it('Should update the existing contact', async () => {
            const random = getRandomValue();
            const signupDto = {
                email: `test-${random}@example.com`,
                password: 'password',
                username: `Test-User-${random}`
            };
            const res = await createNewUser(signupDto);
            const createContactRequest = {
                firstname: `${random}`,
                lastname: `John ${random}`,
                phoneNumber: '08103078881',
                userId: res.id
            }
            const contact = await createNewContact(createContactRequest)
            const updateContactRequest = {
                firstname: `${random}`,
                lastname: `John ${random}`,
                phoneNumber: '08103078882',
                id: contact.id
            }
            const updatedContact = await updateAContact(updateContactRequest, res.id);
            expect(updatedContact.firstname).toEqual(updateContactRequest.firstname);
            expect(updatedContact.lastname).toEqual(updateContactRequest.lastname);
            expect(updatedContact.phoneNumber).toEqual(updateContactRequest.phoneNumber);
        });

    });

    describe("Find Contact",  () => {
        it('Should get an existing contact', async () => {
            const random = getRandomValue();
            const signupDto = {
                email: `test-${random}@example.com`,
                password: 'password',
                username: `Test-User-${random}`
            };
            const res = await createNewUser(signupDto);
            const createContactRequest = {
                firstname: `${random}`,
                lastname: `John ${random}`,
                phoneNumber: '08103078881',
                userId: res.id
            }
            const contact = await createNewContact(createContactRequest)
            const foundContact = await retrieveASingleContact(contact.id, res.id);
            expect(foundContact.firstname).toEqual(contact.firstname);
            expect(foundContact.lastname).toEqual(contact.lastname);
            expect(foundContact.phoneNumber).toEqual(contact.phoneNumber);
        });

        it('Should throw error for non-existing contact', async () => {
            const random = getRandomValue();
            const signupDto = {
                email: `test-${random}@example.com`,
                password: 'password',
                username: `Test-User-${random}`
            };
            const res = await createNewUser(signupDto);
            expect.assertions(3);
            try {
                await retrieveASingleContact(123, res.id)
            } catch (error) {
                expect(error).toBeInstanceOf(ContactNotFoundException);
                expect(error.message).toBe('Contact not found!');
                expect(error.statusCode).toBe(404);
            }
        });
    });

    describe("Delete Contact",  () => {
        it('Should delete an existing contact', async () => {
            const random = getRandomValue();
            const signupDto = {
                email: `test-${random}@example.com`,
                password: 'password',
                username: `Test-User-${random}`
            };
            const res = await createNewUser(signupDto);
            const createContactRequest = {
                firstname: `${random}`,
                lastname: `John ${random}`,
                phoneNumber: '08103078881',
                userId: res.id
            }
            expect.assertions(4);
            const contact = await createNewContact(createContactRequest)
            const result = await deleteAContact(contact.id, res.id);
            expect(result).toEqual('SUCCESSFUL');

            // should not find contact after it has been deleted
            try {
                await retrieveASingleContact(123, res.id)
            } catch (error) {
                expect(error).toBeInstanceOf(ContactNotFoundException);
                expect(error.message).toBe('Contact not found!');
                expect(error.statusCode).toBe(404);
            }
        });

        it('Should throw error for non-existing contact', async () => {
            const random = getRandomValue();
            const signupDto = {
                email: `test-${random}@example.com`,
                password: 'password',
                username: `Test-User-${random}`
            };
            const res = await createNewUser(signupDto);
            expect.assertions(3);
            try {
                await deleteAContact(123, res.id)
            } catch (error) {
                expect(error).toBeInstanceOf(ContactNotFoundException);
                expect(error.message).toBe('Contact not found!');
                expect(error.statusCode).toBe(404);
            }
        });
    });

});


function getRandomValue() {
    const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const randomIndex1 = Math.floor(Math.random() * alphabet.length);
    const randomIndex2 = Math.floor(Math.random() * alphabet.length);
    const number = Math.random();
    return `${alphabet[randomIndex1]}${number}${alphabet[randomIndex2]}`;
}