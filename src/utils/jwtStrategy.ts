import { Strategy as JwtStrategy, VerifiedCallback } from 'passport-jwt';
import { JwtPayload } from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import AuthRepository from '../repositories/auth-repositorie';
import passport from 'passport';
const authRepository = new AuthRepository();

const accessTokenOptions = {
  jwtFromRequest: (req: express.Request) =>
    req.cookies[process.env.ACCESS_TOKEN_COOKIE_NAME as string],
  secretOrKey: process.env.JWT_ACCESS_TOKEN_SECRET as string,
};

const refreshTokenOptions = {
  jwtFromRequest: (req: express.Request) =>
    req.cookies[process.env.REFRESH_TOKEN_COOKIE_NAME as string],
  secretOrKey: process.env.JWT_REFRESH_TOKEN_SECRET as string,
};

const jwtVerify = async (payload: JwtPayload, done: VerifiedCallback) => {
  try {
    const userId = Number(payload.sub);
    const user = await authRepository.getUserById(userId);
    if (!user) {
      return done(null, false);
    }
    done(null, user);
  } catch (error) {
    done(error, false);
  }
};

const accessTokenStrategy = new JwtStrategy(accessTokenOptions, jwtVerify);

const refreshTokenStrategy = new JwtStrategy(refreshTokenOptions, jwtVerify);

passport.use('access-token', accessTokenStrategy);
passport.use('refresh-token', refreshTokenStrategy);

export default passport;
