const {sq} = require("../utils/database");
const Contact = require("../models/Contact")
const User = require("../models/User");
const {createNewUser, loginUser} = require("../service/authService");
const EmailAlreadyExistsException = require("../exceptions/EmailAlreadyExistsException");
const UsernameAlreadyExistsException = require("../exceptions/UsernameAlreadyExistsException");
const IncorrectPasswordException = require("../exceptions/IncorrectPasswordException");
const UserNotFoundException = require("../exceptions/UserNotFoundException");
const {createNewContact} = require("../service/contactService");

describe("Contacts Service Test", () => {

    beforeAll(async function(){
        await sq.sync( { force: true });
    });
    afterAll(async function(){
        await sq.close();
    });

    describe("Create contact tes", () => {
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
            userId: res.id;
        }

        it('Should create a new contact', async () => {
            const contact = await createNewContact(createContactRequest)
            expect(contact.firstname).toEqual(createContactRequest.firstname);
            expect(contact.lastname).toEqual(createContactRequest.lastname);
            expect(contact.phoneNumber).toEqual(createContactRequest.phoneNumber);
        });

        it('Should not create a new contact with the same phone number', async () => {
            expect.assertions(3);
            try {
                await createNewContact(createContactRequest)
            } catch (error) {
                expect(error).toBeInstanceOf(PhoneNumberAlreadyExistsException);
                expect(error.message).toBe('This email is already registered!');
                expect(error.statusCode).toBe(400);
            }
        });

        it('Should not create a new user with the same username', async () => {
            expect.assertions(3);
            signupDto.email = `test-${random}-2@example.com`;
            try {
                await createNewUser(signupDto);
            } catch (error) {
                expect(error).toBeInstanceOf(UsernameAlreadyExistsException);
                expect(error.message).toBe('This username is already taken!');
                expect(error.statusCode).toBe(400);
            }
        });

    });


    describe("User Login", () => {
        const random = getRandomValue();
        it('User should be able to login', async () => {
            const signupDto = {
                email: `test-${random}@example.com`,
                password: 'password',
                username: `Test-User-${random}`
            };
            await createNewUser(signupDto);
            const loginRequest = {
                email: signupDto.email,
                password: signupDto.password,
            };
            const token = await loginUser(loginRequest);
            expect(token).toBeDefined();
        });

        it('User should not be able to login with the wrong password', async () => {

            const loginRequest = {
                email: `test-${random}@example.com`,
                password: 'password-01',
            };

            expect.assertions(3);
            try {
                await loginUser(loginRequest);
            } catch (error) {
                expect(error).toBeInstanceOf(IncorrectPasswordException);
                expect(error.message).toBe('Incorrect Password!');
                expect(error.statusCode).toBe(401);
            }
        });

        it('Non existent user should not be able to login', async () => {
            const loginRequest = {
                email: 'fake@example.com',
                password: 'password',
            };

            expect.assertions(3);

            try {
                await loginUser(loginRequest);
            } catch (error) {
                expect(error).toBeInstanceOf(UserNotFoundException);
                expect(error.message).toBe('User not found!');
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