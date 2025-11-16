import express from 'express';
import { 
    register, 
    login, 
    logout, 
    sendVerifyOtp, 
    verifyEmail, 
    isAuthenticated, 
    sendRestOtp, 
    resetPassword,
    firebaseLogin // 👈 Import new controller
} from '../controllers/authController.js';
import userAuth from '../Middlewares/userAuth.js';

const authRouter = express.Router();

authRouter.post('/register', register);
authRouter.post('/login',login);
authRouter.post('/logout', logout);

// NEW GOOGLE ROUTE
authRouter.post('/firebase-login', firebaseLogin); // 👈 New route for Google Sign-In

authRouter.post('/send-verify-otp', userAuth ,sendVerifyOtp);
authRouter.post('/verify-account',userAuth,verifyEmail);
authRouter.get('/is-auth',userAuth,isAuthenticated);
authRouter.post('/send-reset-otp',sendRestOtp);
authRouter.post('/reset-password',resetPassword);

export default authRouter;