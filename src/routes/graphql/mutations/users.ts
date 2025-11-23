import {
  GraphQLNonNull,
  GraphQLString,
} from 'graphql';
import { PrismaClient } from '@prisma/client';
import { UUIDType } from '../types/uuid.js';
import { UserType } from '../types/users.js';
import {CreateUserInput, ChangeUserInput } from '../inputs/users.js';

interface CreateUserInterface {
  dto: {
    name: string;
    balance: number;
  };
}

interface ChangeUserInterface {
  id: string;
  dto: {
    name?: string;
    balance?: number;
  };
}

export const createUser = (prisma: PrismaClient) => ({
  type: new GraphQLNonNull(UserType),
  args: { dto: { type: new GraphQLNonNull(CreateUserInput) } },
  resolve: (_, { dto }: CreateUserInterface) => prisma.user.create({ data: dto }),
});

export const changeUser = (prisma: PrismaClient) => ({
  type: new GraphQLNonNull(UserType),
  args: {
    id: { type: new GraphQLNonNull(UUIDType) },
    dto: { type: new GraphQLNonNull(ChangeUserInput) },
  },
  resolve: (_, { id, dto }: ChangeUserInterface) =>
    prisma.user.update({ where: { id }, data: dto }),
});

export const deleteUser = (prisma: PrismaClient) => ({
  type: new GraphQLNonNull(GraphQLString),
  args: { id: { type: new GraphQLNonNull(UUIDType) } },
  resolve: async (_, { id }: { id: string }) => {
    await prisma.user.delete({ where: { id } });
    return "User deleted";
  },
});