const ContactsAppException = require("./GlobalException");

class ContactNotFoundException extends ContactsAppException {

    constructor(message) {
        super(message, 404);
    }

}

module.exports = ContactNotFoundException;