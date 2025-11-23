import { GraphQLNonNull, GraphQLString } from 'graphql';
import { UUIDType } from '../types/uuid.js';
import { ProfileType } from '../types/profiles.js';
import { CreateProfileInput, ChangeProfileInput } from '../inputs/profiles.js';
import { PrismaClient } from '@prisma/client';

interface CreateProfilesInterface {
  dto: {
    userId: string;
    isMale: boolean;
    yearOfBirth: number;
    memberTypeId: string;
  };
}

interface ChangeProfileInterface {
  id: string;
  dto: {
    isMale?: boolean;
    yearOfBirth?: number;
    memberTypeId?: string;
  };
}

export const createProfile = (prisma: PrismaClient) => ({
  type: new GraphQLNonNull(ProfileType),
  args: { dto: { type: new GraphQLNonNull(CreateProfileInput) } },
  resolve: (_, { dto }: CreateProfilesInterface) => prisma.profile.create({ data: dto }),
});

export const changeProfile = (prisma: PrismaClient) => ({
  type: new GraphQLNonNull(ProfileType),
  args: {
    id: { type: new GraphQLNonNull(UUIDType) },
    dto: { type: new GraphQLNonNull(ChangeProfileInput) },
  },
  resolve: (_, { id, dto }: ChangeProfileInterface) =>
    prisma.profile.update({ where: { id }, data: dto }),
});

export const deleteProfile = (prisma: PrismaClient) => ({
  type: new GraphQLNonNull(GraphQLString),
  args: { id: { type: new GraphQLNonNull(UUIDType) } },
  resolve: async (_, { id }: { id: string }) => {
    await prisma.profile.delete({ where: { id } });
    return 'Profile deleted successfully';
  },
});
