import {
  GraphQLObjectType,
  GraphQLNonNull,
  GraphQLList,
  GraphQLString,
  GraphQLFloat,
} from 'graphql';
import { UUIDType } from './types/uuid.js';
import { ProfileType } from './profiles.js';
import { PostType } from './posts.js';


export const UserType = new GraphQLObjectType({
  name: 'User',
  fields: () => ({
    id: { type: new GraphQLNonNull(UUIDType) },
    name: { type: new GraphQLNonNull(GraphQLString) },
    balance: { type: new GraphQLNonNull(GraphQLFloat) },
    profile: {
      type: ProfileType,
      resolve: async (user, _args, { prisma }) => {
        return prisma.profile.findUnique({
          where: { userId: user.id },
        });
      },
    },
    posts: {
      type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(PostType))),
      resolve: async (user, _args, { prisma }) => {
        return prisma.post.findMany({
          where: { authorId: user.id },
        });
      },
    },
    // userSubscribedTo: {
    //   type: new GraphQLList(UserType),
    //   resolve: async (user, _args, context) => {
    //     const subs = await context.prisma.subscribersOnAuthors.findMany({
    //       where: { subscriberId: user.id },
    //       include: { author: true },
    //     });
    //     return subs.map((s) => s.author);
    //   },
    // },
    // subscribedToUser: {
    //   type: new GraphQLList(UserType),
    //   resolve: async (user, _args, context) => {
    //     const subs = await context.prisma.subscribersOnAuthors.findMany({
    //       where: { authorId: user.id },
    //       include: { subscriber: true },
    //     });
    //     return subs.map((s) => s.subscriber);
    //   },
    // },
      userSubscribedTo: {
      type: new GraphQLList(UserType),
      resolve: async (user, _args, { prisma }) => {
        const userWithSubs = await prisma.user.findUnique({
          where: { id: user.id },
          include: {
            userSubscribedTo: { include: { author: true } },
          },
        });
        return userWithSubs?.userSubscribedTo.map((sub) => sub.author) ?? [];
      },
    },

    subscribedToUser: {
      type: new GraphQLList(UserType),
      resolve: async (user, _args, { prisma }) => {
        const userWithSubs = await prisma.user.findUnique({
          where: { id: user.id },
          include: {
            subscribedToUser: { include: { subscriber: true } },
          },
        });
        return userWithSubs?.subscribedToUser.map((sub) => sub.subscriber) ?? [];
      },
    }
  }),
});


export const usersQuery = (prisma) => ({
    type: new GraphQLList(new GraphQLNonNull(UserType)),
  resolve: async () => {
    return prisma.user.findMany();
  },
});

export const userQuery = (prisma) => ({
  type: UserType,
  args: {
    id: { type: new GraphQLNonNull(UUIDType) },
  },
  resolve: async (_root, args) => {
    return await prisma.user.findUnique({
      where: { id: args.id },
    });
  },
});
