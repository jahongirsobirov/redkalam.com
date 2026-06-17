import dotenv from 'dotenv';
dotenv.config();

import {
    getUserByEmailAndPassword,
    registerNewUserByEmail,
    verifyUserByOtpCode,
    resendOtpToUserById,
    passwordResetByEmail,
    verifyUserByOtpCodeForPasswordChanging,
    updatePasswordByEmail,
    loginOrRegisterUserWithGoogleData
} from "../services/auth.service.js";
import jwt from 'jsonwebtoken';
import AuthVerify from "auth-verify";
import {google} from "../../index.js"

const auth = new AuthVerify({});

export const userLogin = async (req, res, next) => {
    try{
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(401).json({
                message: "Email or/and password is/are not filled",
                data: {
                    success: false,
                }
            });
        }

        const result = await getUserByEmailAndPassword(email, password);

        if (!result.data.success) {
            return res.status(401).json(result);
        }

        return res.status(200).json(result);
    }catch(err){
        next(err);
    }
}

export const userRegister = async (req, res, next) => {
    try{
        const {username, email, password} = req.body;
        if (!email || !password || !username) {
            return res.status(401).json(JSON.stringify({
                message: "Email or/and password or/and username is/are not filled",
                data: {
                    success: false,
                }
            }));
        }

        const newUser = await registerNewUserByEmail(username, email, password);
        return res.status(200).json(newUser);
    }catch(err){
        next(err);
    }
}

export const userVerification = async (req, res, next) => {
    try{
        const {userId, email} = req.user;
        const {otpCode} = req.body;

        if (!otpCode) {
            return res.status(401).json(JSON.stringify({
                message: "Email or/and OTP code is/are not filled",
                data: {
                    success: false,
                }
            }))
        }

        const verifyUser = await verifyUserByOtpCode(userId, email, otpCode);
        return res.status(200).json(verifyUser);
    }catch(err){
        next(err);
    }
}

export const userVerificationByResendOtp = async (req, res, next) => {
    try{
        const {userId, email} = req.user;
        const resendOtpToUser = await resendOtpToUserById(userId, email);
        return res.status(200).json(resendOtpToUser);
    }catch(err){
        next(err);
    }
}

export const forgotPassword = async (req, res, next) => {
    try{
        const {email} = req.body;
        if(!email){
            return res.status(401).json(JSON.stringify({
                message: `Email is not filled! Email: ${email} `,
                data: {
                    success: false,
                }
            }));
        }

        const passwordReset = await passwordResetByEmail(email);
        console.log(passwordReset);
        return res.status(200).json(passwordReset);
    }catch(err){
        next(err);
    }
}

export const forgotPasswordOtpVerification = async (req, res, next) => {
    try {
        const {email, otpCode} = req.body;
        if (!email || !otpCode) {
            return res.status(401).json(JSON.stringify({
                message: "Email or/and otp code is/are not filled",
                data: {
                    success: false,
                }
            }))
        }

        const verifyUserByOtpCode = await verifyUserByOtpCodeForPasswordChanging(email, otpCode);
        return res.status(200).json(verifyUserByOtpCode);
    }catch(err){
        next(err);
    }
}

export const resetPassword = async (req, res, next) => {
    try {
        const {email, password} = req.body;
        if (!email || !password) {
            return res.status(401).json(JSON.stringify({
                message: "Email or/and password is/are not filled",
                data: {
                    success: false,
                }
            }));
        }

        const passwordReset = await updatePasswordByEmail(email, password);
        return res.status(200).json(passwordReset);
    }catch(err){
        next(err);
    }
}

export const refreshUserToken  = async (req, res, next) => {
    try{
        const {userId, username, email} = req.user;
        const userToken = jwt.sign({userId: userId, username, email}, process.env.JWT_SECRET, {
            expiresIn: "20d"
        });

        return res.status(200).json({
            message: `User token refreshed`,
            data: {
                success: true,
                userToken,
            }
        });
    }catch(err){
        next(err);
    }
}

// const google = auth.oauth.google({
//     clientId: process.env.GOOGLE_CLIENT_ID,
//     clientSecret: process.env.GOOGLE_CLIENT_SECRET,
//     redirectUri: process.env.GOOGLE_REDIRECT_URI
// });

export const logInOrRegisterUserWithGoogle = async (req, res, next) => {
    try{
        google.redirect(res);
    }catch(err){
        next(err);
    }
}

export const logInOrRegisterUserWithGoogleCallback = async (req, res, next) => {
    try {
        const code = req.query.code;
        const user = await google.callback(code);

        const authenticateUserWithGoogleData = await loginOrRegisterUserWithGoogleData(user);
        // return res.status(200).json(authenticateUserWithGoogleData);
        if((authenticateUserWithGoogleData.message === "User successfully registered with google data" || authenticateUserWithGoogleData.message === "Successfully verified with google data") && authenticateUserWithGoogleData.data.success && authenticateUserWithGoogleData.data.userToken){
            return res.redirect(
                `http://localhost:5173/auth/google/callback?token=${authenticateUserWithGoogleData.data.userToken}`
            );
        }else{
            console.log("Verification failed");
            console.log(authenticateUserWithGoogleData);
        }
    }catch(err){
        next(err);
    }
}

export const checkGoogleCredential = async (req, res, next) => {
    try {
        return res.status(200).json({
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            redirectUri: process.env.GOOGLE_REDIRECT_URI,
        })
    }catch(err){
        next(err);
    }
}