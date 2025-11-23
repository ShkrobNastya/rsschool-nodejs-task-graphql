import {
  GraphQLNonNull,
  GraphQLString,
} from 'graphql';
import { PrismaClient } from '@prisma/client';
import { UUIDType } from '../types/uuid.js';
    
export const unsubscribeFrom = (prisma: PrismaClient) => ({
  type: new GraphQLNonNull(GraphQLString),
  args: {
    userId: { type: new GraphQLNonNull(UUIDType) },
    authorId: { type: new GraphQLNonNull(UUIDType) },
  },
  resolve: async (_, { userId, authorId }: { userId: string; authorId: string }) => {
    await prisma.subscribersOnAuthors.delete({
      where: { subscriberId_authorId: { subscriberId: userId, authorId } },
    });
    return "Unsubscribed successfully";
  },
});
