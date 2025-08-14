import express, { RequestHandler } from 'express';
import { handleError } from '../middlewares/error-handler';
import { Users } from '@prisma/client';
import validator from 'validator';
import bcrypt from 'bcrypt';
import AuthRepository from '../repositories/auth-repositorie';
import { generateTokens, verifyRefreshToken } from '../utils/token';
import { statusCode } from '../middlewares/error-handler';
import dotenv from 'dotenv';
dotenv.config();
class AuthService {
  private authRepository = new AuthRepository();

  register: RequestHandler = async (req, res, next) => {
    try {
      const { email, password, name, profileImage, provider } = req.body as Users;
      if (!validator.isEmail(email)) {
        handleError(
          next,
          '이메일 형식이 올바르지 않습니다.',
          '이메일 형식이 올바르지 않습니다.',
          statusCode.badRequest
        );
        return;
      }
      const hashedPassword = await bcrypt.hash(password, 10);
      const existingUser = await this.authRepository.getUserByEmail(email);
      if (existingUser) {
        handleError(
          next,
          '이미 가입된 이메일입니다.',
          '이미 가입된 이메일입니다.',
          statusCode.badRequest
        );
        return;
      }

      // DB에 저장
      const user = await this.authRepository.createUser(
        email,
        name,
        hashedPassword,
        profileImage,
        provider
      );

      // 응답 가공
      const response = {
        id: user.id,
        email: user.email,
        name: user.name,
        profileImage: user.profileImage,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      };
      res.status(201).send(response);
    } catch (err) {
      next(err);
    }
  };

  login: RequestHandler = async (req, res, next) => {
    try {
      const user = await this.authRepository.getUserByEmail(req.body.email);
      if (!user) {
        handleError(
          next,
          '존재하지 않는 이메일입니다.',
          '존재하지 않는 이메일입니다.',
          statusCode.notFound
        );
        return;
      }
      const isMatch = await bcrypt.compare(req.body.password, user.password);
      if (!isMatch) {
        handleError(
          next,
          '비밀번호가 일치하지 않습니다.',
          '비밀번호가 일치하지 않습니다.',
          statusCode.notFound
        );
        return;
      }
      // 토큰 생성
      const { accessToken, refreshToken } = generateTokens(user.id);

      // 쿠키 설정
      this.setTokenCookies(res, accessToken, refreshToken);

      // refresh token db저장
      await this.saveRefreshToken(user.id, refreshToken);

      res.status(200).send({ accessToken, refreshToken });
    } catch (err) {
      next(err);
    }
  };

  refresh: RequestHandler = async (req, res, next) => {
    try {
      const refreshToken: string | undefined =
        req.cookies[process.env.REFRESH_TOKEN_COOKIE_NAME as string];
      if (!refreshToken) {
        handleError(
          next,
          'Refresh token이 없습니다.',
          'Refresh token이 없습니다.',
          statusCode.unauthorized
        );
        return;
      }
      const decoded = verifyRefreshToken(refreshToken);
      if (decoded === 'EXPIRED') {
        handleError(
          next,
          'Refresh token이 만료되었습니다.',
          'Refresh token이 만료되었습니다.',
          statusCode.unauthorized
        );
        return;
      }
      if (decoded === null) {
        handleError(
          next,
          'Refresh token이 유효하지 않습니다.',
          'Refresh token이 유효하지 않습니다.',
          statusCode.unauthorized
        );
        return;
      }

      const userId = Number(decoded.sub);
      // 토큰 생성
      const { accessToken: newaccessToken, refreshToken: newRefreshToken } = generateTokens(userId);
      // 쿠키 설정
      this.setTokenCookies(res, newaccessToken, newRefreshToken);
      // refresh token 저장
      await this.saveRefreshToken(userId, newRefreshToken);
      res.status(200).send({ accessToken: newaccessToken, refreshToken: newRefreshToken });
    } catch (err) {
      next(err);
    }
  };

  googleCallback: RequestHandler = async (req: express.Request, res, next) => {
    try {
      if (!req.user) {
        handleError(
          next,
          '구글 로그인 정보가 없습니다.',
          '구글 로그인 정보가 없습니다.',
          statusCode.notFound
        );
        return;
      }
      const user = await this.authRepository.getUserById(req.user.id);
      if (!user) {
        handleError(
          next,
          '존재하지 않는 사용자입니다.',
          '존재하지 않는 사용자입니다.',
          statusCode.notFound
        );
        return;
      }
      // 토큰 생성
      const { accessToken, refreshToken } = generateTokens(user.id);
      // 쿠키 설정
      this.setTokenCookies(res, accessToken, refreshToken);
      // refresh token db저장
      await this.saveRefreshToken(user.id, refreshToken);
      // 쿼리 파라미터로 토큰을 포함하여 프론트엔드 사이트에 리디렉션
      const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
      const redirectUrl = `${frontendUrl}/api/google?accessToken=${accessToken}&refreshToken=${refreshToken}`;
      res.redirect(redirectUrl);
    } catch (err) {
      next(err);
    }
  };

  saveRefreshToken = async (userId: number, refreshToken: string) => {
    await this.authRepository.deleteRefreshToken(userId);
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
    await this.authRepository.saveRefreshToken(userId, refreshToken, expiresAt);
  };

  setTokenCookies(res: express.Response, accessToken: string, refreshToken: string) {
    res.cookie(process.env.ACCESS_TOKEN_COOKIE_NAME as string, accessToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'none',
      path: '/',
      maxAge: 1 * 60 * 60 * 1000, // 1 hour
    });
    res.cookie(process.env.REFRESH_TOKEN_COOKIE_NAME as string, refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'none',
      path: '/',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });
  }
}

export default AuthService;
