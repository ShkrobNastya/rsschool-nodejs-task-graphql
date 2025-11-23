import { GraphQLNonNull, GraphQLString } from 'graphql';
import { PrismaClient } from '@prisma/client';
import { UUIDType } from '../types/uuid.js';

export const subscribeTo = (prisma: PrismaClient) => ({
  type: new GraphQLNonNull(GraphQLString),
  args: {
    userId: { type: new GraphQLNonNull(UUIDType) },
    authorId: { type: new GraphQLNonNull(UUIDType) },
  },
  resolve: async (_, { userId, authorId }: { userId: string; authorId: string }) => {
    await prisma.subscribersOnAuthors.create({
      data: { subscriberId: userId, authorId },
    });
    return 'Subscribed successfully';
  },
});
