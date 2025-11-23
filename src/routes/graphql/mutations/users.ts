import {
  GraphQLNonNull,
  GraphQLString,
} from 'graphql';
import { PrismaClient } from '@prisma/client';
import { UUIDType } from '../types/uuid.js';
import { UserType } from '../types/users.js';
import {CreateUserInput, ChangeUserInput } from '../inputs/users.js';

export const createUser = (prisma: PrismaClient) => ({
  type: new GraphQLNonNull(UserType),
  args: { dto: { type: new GraphQLNonNull(CreateUserInput) } },
  resolve: (_, { dto }) => prisma.user.create({ data: dto }),
});

export const changeUser = (prisma: PrismaClient) => ({
  type: new GraphQLNonNull(UserType),
  args: {
    id: { type: new GraphQLNonNull(UUIDType) },
    dto: { type: new GraphQLNonNull(ChangeUserInput) },
  },
  resolve: (_, { id, dto }) =>
    prisma.user.update({ where: { id }, data: dto }),
});

export const deleteUser = (prisma: PrismaClient) => ({
  type: new GraphQLNonNull(GraphQLString),
  args: { id: { type: new GraphQLNonNull(UUIDType) } },
  resolve: async (_, { id }) => {
    await prisma.user.delete({ where: { id } });
    return "User deleted";
  },
});