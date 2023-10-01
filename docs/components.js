module.exports = {
    components: {
        schemas: {
            // id model
            id: {
                type: "integer",
                description: "An id of a contact",
                example: "1",
            },
            // representation of contact model
            ContactDto: {
                type: "object",
                properties: {
                    id: {
                        type: "integer",
                        description: "An id of a contact",
                        example: "1",
                    },
                    firstname: {
                        type: "string",
                        description: "Contact's Firstname",
                        example: "John",
                    },
                    lastname: {
                        type: "string",
                        description: "Contact's Lastname",
                        example: "Doe",
                    },
                    phoneNumber: {
                        type: "string",
                        description: "Contact's Phone number",
                        example: "+2348103078881",
                    },
                },
            },
            // representation of user model
            UserDto: {
                type: "object", // data type
                properties: {
                    id: {
                        type: "integer",
                        description: "An id of a user",
                        example: "1",
                    },
                    username: {
                        type: "string",
                        description: "Username of user",
                        example: "Johnny",
                    },
                    email: {
                        type: "string",
                        description: "User's email",
                        example: "john-doe@gmail.com",
                    },
                    password: {
                        type: "string",
                        description: "User's chosen password",
                        example: "password",
                    },
                },
            },
            // error model
            Error: {
                type: "object",
                properties: {
                    message: {
                        type: "string",
                        description: "Error message",
                        example: "Not found",
                    },
                },
            },
        },
    },
};