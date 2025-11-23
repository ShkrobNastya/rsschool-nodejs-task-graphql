import { Type } from '@fastify/type-provider-typebox';
import {
  GraphQLSchema,
  GraphQLObjectType,
} from 'graphql';
import {
  memberTypesQuery,
  memberTypeQuery,
} from './types/memberTypes.js';
import {
  postQuery,
  postsQuery
} from './types/posts.js';
import { profileQuery, profilesQuery } from './types/profiles.js';
import { userQuery, usersQuery } from './types/users.js';
import { createUser, changeUser,deleteUser} from './mutations/users.js';
import { createProfile, changeProfile, deleteProfile } from './mutations/profiles.js';
import { createPost, changePost, deletePost } from './mutations/posts.js';
import { subscribeTo } from './mutations/subscribeTo.js';
import { unsubscribeFrom } from './mutations/unsubscribeFrom.js';
import { PrismaClient } from '@prisma/client';

export const gqlResponseSchema = Type.Partial(
  Type.Object({
    data: Type.Any(),
    errors: Type.Any(),
  }),
);

export const createGqlResponseSchema = {
  body: Type.Object(
    {
      query: Type.String(),
      variables: Type.Optional(Type.Record(Type.String(), Type.Any())),
    },
    {
      additionalProperties: false,
    },
  ),
};

export const createSchema = (prisma: PrismaClient) =>
  new GraphQLSchema({
    query: new GraphQLObjectType({
      name: 'RootQueryType',
      fields: {
        memberTypes: memberTypesQuery(prisma),
        memberType: memberTypeQuery(prisma),
        posts: postsQuery(prisma),
        post: postQuery(prisma),
        users: usersQuery(prisma),
        user: userQuery(prisma),
        profiles: profilesQuery(prisma),
        profile: profileQuery(prisma),
      },
    }),
    mutation: new GraphQLObjectType({
      name: 'Mutations',
      fields: {
        createUser: createUser(prisma),
        createProfile: createProfile(prisma),
        createPost: createPost(prisma),
        changeUser: changeUser(prisma),
        changeProfile: changeProfile(prisma),
        changePost: changePost(prisma),
        deleteUser: deleteUser(prisma),
        deletePost: deletePost(prisma),
        deleteProfile: deleteProfile(prisma),
        subscribeTo: subscribeTo(prisma),
        unsubscribeFrom: unsubscribeFrom(prisma),
      },
    }),
  });