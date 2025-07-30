import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

export function generateTokens(userId: number) {
  const accessToken = jwt.sign({ sub: userId }, process.env.JWT_ACCESS_TOKEN_SECRET as string, {
    expiresIn: '1h',
  });
  const refreshToken = jwt.sign({ sub: userId }, process.env.JWT_REFRESH_TOKEN_SECRET as string, {
    expiresIn: '7d',
  });
  return { accessToken, refreshToken };
}

export function verifyRefreshToken(token: string): jwt.JwtPayload | null | string {
  try {
    const decoded = jwt.verify(token, process.env.JWT_REFRESH_TOKEN_SECRET as string);
    return decoded;
  } catch (err) {
    if (err instanceof jwt.TokenExpiredError) {
      return 'EXPIRED';
    }
    return null;
  }
}