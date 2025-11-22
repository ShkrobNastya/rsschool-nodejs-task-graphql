import {
  GraphQLObjectType,
  GraphQLNonNull,
  GraphQLList,
  GraphQLBoolean,
  GraphQLInt,
} from 'graphql';
import { UUIDType } from './types/uuid.js';
import { MemberTypeType } from './memberTypes.js';

export const ProfileType = new GraphQLObjectType({
  name: 'Profile',
  fields: () => ({
    id: { type: new GraphQLNonNull(UUIDType) },
    isMale: { type: new GraphQLNonNull(GraphQLBoolean) },
    yearOfBirth: { type: new GraphQLNonNull(GraphQLInt) },
    memberType: {
      type: new GraphQLNonNull(MemberTypeType),
      resolve: async (profile, _args, { prisma }) => {
        return prisma.memberType.findUnique({
          where: { id: profile.memberTypeId },
        });
      },
    },
  }),
});

export const profilesQuery = (prisma) => ({
  type: new GraphQLList(new GraphQLNonNull(ProfileType)),
  resolve: async () => {
    return prisma.profile.findMany();
  },
});

export const profileQuery = (prisma) => ({
  type: ProfileType,
  args: {
    id: { type: new GraphQLNonNull(UUIDType) },
  },
  resolve: async (_root, args) => {
    return await prisma.profile.findUnique({
      where: { id: args.id },
    });
  },
});
