import express from 'express';
import AuthService from '../services/auth-service';
import { Users } from '@prisma/client';

const authService = new AuthService();

class AuthController {
    register: express.RequestHandler = async (req, res, next) => {
        try {
            req.body.provider = 'email' as Users['provider'];
            const user = await authService.register(req.body);
            res.status(201).send(user);
        } catch (err) {
            next(err);
        }
    }
}

export default AuthController;