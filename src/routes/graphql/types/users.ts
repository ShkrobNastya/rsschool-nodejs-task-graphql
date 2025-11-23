import {
  GraphQLObjectType,
  GraphQLNonNull,
  GraphQLList,
  GraphQLString,
  GraphQLFloat,
  GraphQLResolveInfo,
} from 'graphql';
import { PrismaClient, User, Prisma } from '@prisma/client';
import { parseResolveInfo, ResolveTree } from 'graphql-parse-resolve-info';
import { UUIDType } from './uuid.js';
import { ProfileType } from './profiles.js';
import { PostType } from './posts.js';
import { GraphQLContext } from '../index.js';

export const UserType = new GraphQLObjectType({
  name: 'User',
  fields: () => ({
    id: { type: new GraphQLNonNull(UUIDType) },
    name: { type: new GraphQLNonNull(GraphQLString) },
    balance: { type: new GraphQLNonNull(GraphQLFloat) },
    profile: {
      type: ProfileType,
      resolve: async (user: User, _args, { loaders }: GraphQLContext) => {
        return loaders.profileByUserId.load(user.id);
      },
    },
    posts: {
      type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(PostType))),
      resolve: async (user: User, _args, { loaders }) => {
        return loaders.postsByUserId.load(user.id);
      },
    },
    userSubscribedTo: {
      type: new GraphQLList(UserType),
      resolve: async (user, _args, ctx) => {
        const subscribers = await ctx.loaders.subscribersBySubscriberId.load(user.id);
        return Promise.all(subscribers.map(subscriber => ctx.loaders.userById.load(subscriber.authorId)));
      },
    },
    subscribedToUser: {
      type: new GraphQLList(UserType),
      resolve: async (user, _args, ctx: GraphQLContext) => {
        const subscribers = await ctx.loaders.subscribersByAuthorId.load(user.id);
        return Promise.all(subscribers.map(subscriber => ctx.loaders.userById.load(subscriber.subscriberId)));
      },
    },
  }),
});

export const usersQuery = (prisma: PrismaClient) => ({
  type: new GraphQLList(new GraphQLNonNull(UserType)),
  resolve: async (_root, _args, { loaders }: GraphQLContext, info: GraphQLResolveInfo) => {
    const parsed = parseResolveInfo(info) as ResolveTree | undefined;
    const userFields = parsed?.fieldsByTypeName?.User;

    const include: Prisma.UserFindManyArgs["include"] = {};
    
    if (userFields?.userSubscribedTo?.fieldsByTypeName?.User !== undefined) {
      include.userSubscribedTo = true;
    }
    if (userFields?.subscribedToUser?.fieldsByTypeName?.User !== undefined) {
      include.subscribedToUser = true;
    }

    const users = await prisma.user.findMany({ include });

    users.forEach(user => {
      loaders.userById.prime(user.id, user);
      
      if (user.userSubscribedTo) {
        loaders.subscribersBySubscriberId.prime(user.id, user.userSubscribedTo);
      }
      if (user.subscribedToUser) {
        loaders.subscribersByAuthorId.prime(user.id, user.subscribedToUser);
      }
    });

    return users;
  },
});

export const userQuery = (prisma: PrismaClient) => ({
  type: UserType as GraphQLObjectType<User, { prisma: PrismaClient }>,
  args: { id: { type: new GraphQLNonNull(UUIDType) } },
  resolve: async (_root, args: {id: string}, { loaders }: GraphQLContext, info: GraphQLResolveInfo) => {
    const parsed = parseResolveInfo(info) as ResolveTree | undefined;
    const userFields = parsed?.fieldsByTypeName?.User;

    const include: Prisma.UserFindUniqueArgs["include"] = {};
    
    if (userFields?.userSubscribedTo?.fieldsByTypeName?.User !== undefined) {
      include.userSubscribedTo = true;
    }
    if (userFields?.subscribedToUser?.fieldsByTypeName?.User !== undefined) {
      include.subscribedToUser = true;
    }

    const user = await prisma.user.findUnique({ where: { id: args.id }, include });
    if (!user) return null;

    loaders.userById.prime(user.id, user);
    
    if (user.userSubscribedTo) {
      loaders.subscribersBySubscriberId.prime(user.id, user.userSubscribedTo);
    }
    if (user.subscribedToUser) {
      loaders.subscribersByAuthorId.prime(user.id, user.subscribedToUser);
    }

    return user;
  },
});