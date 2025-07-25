import express from 'express';
import { Users } from '@prisma/client';
import validator from 'validator';
import bcrypt from 'bcrypt'
import AuthRepository from '../repositories/auth-repositorie';

class AuthService {
  private authRepository = new AuthRepository();
  
  register = async (data: Users) => {
    try {
      if (!validator.isEmail(data.email)) {
        throw new Error('이메일 형식이 올바르지 않습니다.');
      }
      if (!data.password) {
        throw new Error('비밀번호가 필요합니다.');
      }
      const hashedPassword = await bcrypt.hash(data.password, 10);
      const existingUser = await this.authRepository.getUserByEmail(data.email);
      if (existingUser) {
        throw new Error('이미 가입된 이메일입니다.');
      }
      const user = await this.authRepository.createUser(
        data.email,
        data.name,
        hashedPassword,
        data.profileImage,
        data.provider,
        );
      const response =
      {
        id: user.id,
        email: user.email,
        name: user.name,
        profileImage: user.profileImage,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,  
      }
      return response;
    } catch (err) {
      throw err;
    }
  }
}

export default AuthService;
