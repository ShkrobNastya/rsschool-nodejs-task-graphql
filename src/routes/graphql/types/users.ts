import {
  GraphQLObjectType,
  GraphQLNonNull,
  GraphQLList,
  GraphQLString,
  GraphQLFloat,
} from 'graphql';
import { UUIDType } from './uuid.js';
import { ProfileType } from './profiles.js';
import { PostType } from './posts.js';
import { PrismaClient, User } from '@prisma/client';


export const UserType = new GraphQLObjectType({
  name: 'User',
  fields: () => ({
    id: { type: new GraphQLNonNull(UUIDType) },
    name: { type: new GraphQLNonNull(GraphQLString) },
    balance: { type: new GraphQLNonNull(GraphQLFloat) },
    profile: {
      type: ProfileType,
      resolve: async (user: User, _args, { prisma }: { prisma: PrismaClient }) => {
        return prisma.profile.findUnique({
          where: { userId: user.id },
        });
      },
    },
    posts: {
      type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(PostType))),
      resolve: async (user: User, _args, { prisma }: { prisma: PrismaClient }) => {
        return prisma.post.findMany({
          where: { authorId: user.id },
        });
      },
    },
    userSubscribedTo: {
      type: new GraphQLList(UserType),
      resolve: async (user: User, _args, context:{ prisma: PrismaClient }) => {
        const subs = await context.prisma.subscribersOnAuthors.findMany({
          where: { subscriberId: user.id },
          include: { author: true },
        });
        return subs.map((s) => s.author);
      },
    },
    subscribedToUser: {
      type: new GraphQLList(UserType),
      resolve: async (user: User, _args, context:{ prisma: PrismaClient }) => {
        const subs = await context.prisma.subscribersOnAuthors.findMany({
          where: { authorId: user.id },
          include: { subscriber: true },
        });
        return subs.map((s) => s.subscriber);
      },
    },
  }),
});


export const usersQuery = (prisma: PrismaClient) => ({
    type: new GraphQLList(new GraphQLNonNull(UserType)),
  resolve: async () => {
    return prisma.user.findMany();
  },
});

export const userQuery = (prisma: PrismaClient) => ({
  type: UserType as GraphQLObjectType<User, { prisma: PrismaClient }>,
  args: {
    id: { type: new GraphQLNonNull(UUIDType) },
  },
  resolve: async (_root, args: { id: string}) => {
    return await prisma.user.findUnique({
      where: { id: args.id },
    });
  },
});
