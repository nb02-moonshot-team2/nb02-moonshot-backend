import { accessTokenStrategy, refreshTokenStrategy } from './jwtStrategy';
import passport from 'passport';
import googleStrategy from './googleStrategy';

passport.use('access-token', accessTokenStrategy);
passport.use('refresh-token', refreshTokenStrategy);
passport.use('google', googleStrategy);

export default passport;
