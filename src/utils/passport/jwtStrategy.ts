import { Strategy as JwtStrategy, VerifiedCallback } from 'passport-jwt';
import { JwtPayload } from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import AuthRepository from '../../repositories/auth-repositorie';
const authRepository = new AuthRepository();

const accessTokenOptions = {
  jwtFromRequest: (req: express.Request) => {
    //헤더에 토큰이 있는경우
    if (req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer') {
      return req.headers.authorization.split(' ')[1];
    }
    //헤더에 토큰이 없고 쿠키에 토큰이 있는경우
    return req.cookies[process.env.ACCESS_TOKEN_COOKIE_NAME as string];
  },
  secretOrKey: process.env.JWT_ACCESS_TOKEN_SECRET as string,
};

const refreshTokenOptions = {
  jwtFromRequest: (req: express.Request) => {
    //헤더에 토큰이 있는경우
    if (req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer') {
      return req.headers.authorization.split(' ')[1];
    }
    //헤더에 토큰이 없고 쿠키에 토큰이 있는경우
    return req.cookies[process.env.REFRESH_TOKEN_COOKIE_NAME as string];
  },
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

export { accessTokenStrategy, refreshTokenStrategy };
