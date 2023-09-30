const Router = require("express");
const {createNewContact, findAllContactsForAUser, retrieveASingleContact, deleteAContact, updateAContact} = require("../service/contactService");
const contactRouter = Router();


contactRouter.post('/create', async (req, res, next) => {
    try {
        let requestBody = req.body;
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
        const foundContact = await retrieveASingleContact(id, req.user.id);
        const findContactResponse = {
            id: foundContact.id,
            firstname: foundContact.firstname,
            lastname: foundContact.lastname,
            phoneNumber: foundContact.phoneNumber
        }
        res.status(200).json({ contact: findContactResponse });
    } catch (error) {
        next(error);
    }
});

contactRouter.put('/:id', async (req, res, next) => {
    try {
        const id = req.params.id;
        const requestBody = req.body;
        requestBody['id'] = id;
        const result = await updateAContact(requestBody, req.user.id);
        const findContactResponse = {
            id: result.id,
            firstname: result.firstname,
            lastname: result.lastname,
            phoneNumber: result.phoneNumber
        }
        res.status(200).json({ contact: findContactResponse });
    } catch (error) {
        next(error);
    }
});


contactRouter.delete('/:id', async (req, res, next) => {
    try {
        const id = req.params.id;
        const result = await deleteAContact(id, req.user.id);
        res.status(200).json({ message: result });
    } catch (error) {
        next(error);
    }
});

module.exports = contactRouter;