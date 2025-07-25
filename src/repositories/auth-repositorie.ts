import express from 'express';
import { PrismaClient, Users } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

class AuthRepository {
    createUser = async (email: Users['email'], name: Users['name'], hashedPassword: Users['password'], profileImage: Users['profileImage'], provider: Users['provider']) => {
        const user = await prisma.users.create({
            data: {
                email,
                name,                   
                password: hashedPassword,
                profileImage,
                provider,
            },  
        });
        return user;
    }

    getUserByEmail = async (email: Users['email']) => {
        const user = await prisma.users.findUnique({
            where: {
                email,
            },
        });
        return user;
    }
}

export default AuthRepository;