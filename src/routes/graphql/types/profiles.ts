import { PrismaClient, Profile } from '@prisma/client';
import {
  GraphQLObjectType,
  GraphQLNonNull,
  GraphQLList,
  GraphQLBoolean,
  GraphQLInt,
} from 'graphql';
import { UUIDType } from './uuid.js';
import { MemberTypeType } from './memberTypes.js';
import { GraphQLContext } from '../index.js';

export const ProfileType = new GraphQLObjectType({
  name: 'Profile',
  fields: () => ({
    id: { type: new GraphQLNonNull(UUIDType) },
    isMale: { type: new GraphQLNonNull(GraphQLBoolean) },
    yearOfBirth: { type: new GraphQLNonNull(GraphQLInt) },
    memberType: {
      type: new GraphQLNonNull(MemberTypeType),
      resolve: async (profile: Profile, _args, { loaders }: GraphQLContext) => {
        return loaders.memberTypeById.load(profile.memberTypeId);
      },
    },
  }),
});

export const profilesQuery = (prisma: PrismaClient) => ({
  type: new GraphQLList(new GraphQLNonNull(ProfileType)),
  resolve: async (_root, _args) => {
    const profiles = await prisma.profile.findMany();

    return profiles;
  },
});

export const profileQuery = (prisma: PrismaClient) => ({
  type: ProfileType,
  args: {
    id: { type: new GraphQLNonNull(UUIDType) },
  },
  resolve: async (_root, args: { id: string }) => {
    return await prisma.profile.findUnique({
      where: { id: args.id },
    });
  },
});
