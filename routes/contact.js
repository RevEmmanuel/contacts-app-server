const Router = require("express");
const yup = require('yup');
const {createNewContact, findAllContactsForAUser, retrieveASingleContact, deleteAContact, updateAContact} = require("../service/contactService");
const InvalidOtpException = require("../exceptions/InvalidOtpException");
const UnauthorizedException = require("../exceptions/UnauthorizedException");

const contactRouter = Router();

// validation schema
const createContactRequest = yup.object().shape({
    firstname: yup.string().required('Please enter a first name').min(2, 'Please enter a valid first name'),
    lastname: yup.string().required('Please enter a last name').min(2, 'Please enter a valid last name'),
    phoneNumber: yup.string().required().matches(/^(\+234|234|0)(701|702|703|704|705|706|707|708|709|802|803|804|805|806|807|808|809|810|811|812|813|814|815|816|817|818|819|909|908|901|902|903|904|905|906|907)([0-9]{7})$/, 'Phone number must be a valid Nigerian phone number.'),
});


contactRouter.post('/create', async (req, res, next) => {
    try {
        let requestBody = req.body;
        await createContactRequest.validate(requestBody);
        requestBody['userId'] = req.user.id;
        const createdContact = await createNewContact(requestBody);
        const createContactResponse = {
            id: createdContact.id,
            firstname: createdContact.firstname,
            lastname: createdContact.lastname,
            phoneNumber: createdContact.phoneNumber
        }
        res.status(201).json({ message: 'Contact created successfully', createdContact: createContactResponse });
    } catch (error) {
        next(error);
    }
});

contactRouter.get('/all', async (req, res, next) => {
    try {
        const foundContacts = await findAllContactsForAUser(req.user.id);
        res.status(200).json({ contacts: foundContacts });
    } catch (error) {
        next(error);
    }
});

contactRouter.get('/:id', async (req, res, next) => {
    try {
        const id = req.params.id;
        if (!id) {
            throw new UnauthorizedException('Please provide an id');
        }
        const foundContact = await retrieveASingleContact(id, req.user.id);
        const findContactResponse = {
            id: foundContact.id,
            firstname: foundContact.firstname,
            lastname: foundContact.lastname,
            phoneNumber: foundContact.phoneNumber
        }
        res.status(200).json(findContactResponse);
    } catch (error) {
        next(error);
    }
});

contactRouter.put('/:id', async (req, res, next) => {
    try {
        let requestBody = req.body;
        await createContactRequest.validate(requestBody);
        const id = req.params.id
        if (!id) {
            throw new UnauthorizedException('Please provide an id');
        }
        requestBody['id'] = id;
        const result = await updateAContact(requestBody, req.user.id);
        const findContactResponse = {
            id: result.id,
            firstname: result.firstname,
            lastname: result.lastname,
            phoneNumber: result.phoneNumber
        }
        res.status(200).json(findContactResponse);
    } catch (error) {
        next(error);
    }
});


contactRouter.delete('/:id', async (req, res, next) => {
    try {
        const id = req.params.id;
        if (!id) {
            throw new UnauthorizedException('Please provide an id');
        }
        const result = await deleteAContact(id, req.user.id);
        res.status(200).json({ message: result });
    } catch (error) {
        next(error);
    }
});

module.exports = contactRouter;