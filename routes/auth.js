const {createNewUser, loginUser, verifyUser} = require("../service/authService");
const Router = require("express");

const authRouter = Router();

authRouter.post('/signup', async (req, res, next) => {
    try {
        const requestBody = req.body;
        const createdUser = await createNewUser(requestBody);
        const createUserResponse = {
            id: createdUser.id,
            username: createdUser.username,
            createdAt: createdUser.createdAt,
            isVerified: createdUser.isVerified,
            token: createdUser.token
        }
        res.status(201).json({ message: 'User registered successfully', createdUser: createUserResponse });
    } catch (error) {
        next(error);
    }
});

authRouter.post('/login', async (req, res, next) => {
    const loginDto = req.body;
    console.log(loginDto);
    try {
        const token = await loginUser(loginDto);
        res.status(200).json({ token });
    } catch (error) {
        next(error);
    }
})

authRouter.post('/verify/:otp', async (req, res, next) => {
    try {
        const otp = req.params.otp;
        await verifyUser(otp);
        res.status(200).json({ message: 'User verified successfully' });
    } catch (error) {
        next(error);
    }
});

module.exports = authRouter;
