import { Type } from '@fastify/type-provider-typebox';
import {
  GraphQLSchema,
  GraphQLObjectType,
} from 'graphql';
import {
  memberTypesQuery,
  memberTypeQuery,
} from './memberTypes.js';
import {
  postQuery,
  postsQuery
} from './posts.js';
import { profileQuery, profilesQuery } from './profiles.js';
import { userQuery, usersQuery } from './users.js';

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

export const createSchema = (prisma) =>
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
    })
    });