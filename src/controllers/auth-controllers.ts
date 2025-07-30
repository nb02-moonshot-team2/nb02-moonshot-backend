import express from 'express';
import AuthService from '../services/auth-service';
import { Users } from '@prisma/client';

class AuthController {
  private authService = new AuthService();

  register: express.RequestHandler = async (req, res, next) => {
    try {
       req.body.provider = 'email' as Users['provider'];
      await this.authService.register(req, res, next);
    } catch (err) {
      next(err);
    }
  };

  login: express.RequestHandler = async (req, res, next) => {
    try {
      await this.authService.login(req, res, next);
    } catch (err) {
      next(err);
    }
  };

  refresh: express.RequestHandler = async (req, res, next) => {
    try {
      await this.authService.refresh(req, res, next);
    } catch (err) {
      next(err);
    }
  };

  googleCallback: express.RequestHandler = async (req, res, next) => {
    try {
      await this.authService.googleCallback(req, res, next);
    } catch (err) {
      next(err);
    }
  };

  test: express.RequestHandler = async (req, res, next) => {
    try {
      res.send(req.user);
    } catch (err) {
      next(err);
    }
  };
}



export default AuthController;
