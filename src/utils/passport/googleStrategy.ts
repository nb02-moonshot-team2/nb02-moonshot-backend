import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { Request } from 'express';
import AuthRepository from '../../repositories/auth-repositorie';
import { Profile } from 'passport';

const authRepository = new AuthRepository();
const googleStrategy = new GoogleStrategy(
  {
    clientID: process.env.GOOGLE_CLIENT_ID as string,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    callbackURL: process.env.GOOGLE_REDIRECT_URI,
    passReqToCallback: true,
  },
  async (
    req: Request,
    accessToken: string,
    refreshToken: string,
    profile: Profile,
    done: (error: Error | null, user?: Express.User | false, info?: { message: string }) => void
  ) => {
    try {
      const email = profile.emails?.[0]?.value;
      if (!email) {
        return done(null, false, { message: '구글에서 이메일을 제공하지 않았습니다.' });
      }

      // 이미 가입된 유저라면
      const user = await authRepository.getUserByEmail(email);
      if (user) {
        // passport user로 데이터 변환
        const passportUser = {
          ...user,
          nickname: user.name,
          image: user.profileImage,
          refreshToken: null,
        };
        return done(null, passportUser);
      }

      // 구글에서 제공하는 이름 가공
      if (!profile.name?.givenName) {
        return done(null, false, { message: '구글에서 이름을 제공하지 않았습니다.' });
      }
      const newUser = await authRepository.createUser(
        email,
        profile.name?.givenName as string,
        '',
        profile.photos?.[0]?.value as string,
        'google'
      );
      const passportNewUser = {
        ...newUser,
        nickname: newUser.name,
        image: newUser.profileImage,
        refreshToken: null,
      };

      return done(null, passportNewUser);
    } catch (error) {
      return done(error as Error, false);
    }
  }
);

export default googleStrategy;
