import DataLoader from 'dataloader';
import { PrismaClient } from '@prisma/client';

export function createLoaders(prisma: PrismaClient) {
  return {
    userById: new DataLoader(async (ids: readonly string[]) => {
      const users = await prisma.user.findMany({
        where: { id: { in: ids as string[] } },
      });
      const usersMap = new Map(users.map((user) => [user.id, user]));
      return ids.map((id) => usersMap.get(id) || null);
    }),

    profileByUserId: new DataLoader(async (userIds: readonly string[]) => {
      const profiles = await prisma.profile.findMany({
        where: { userId: { in: userIds as string[] } },
      });

      const map = new Map(profiles.map((profile) => [profile.userId, profile]));

      return userIds.map((id) => map.get(id) ?? null);
    }),

    postsByUserId: new DataLoader(async (userIds: readonly string[]) => {
      const posts = await prisma.post.findMany({
        where: { authorId: { in: userIds as string[] } },
      });

      const map = new Map<string, typeof posts>();

      for (const id of userIds) {
        map.set(id, []);
      }

      for (const post of posts) {
        map.get(post.authorId)!.push(post);
      }

      return userIds.map((id) => map.get(id));
    }),

    subscribersBySubscriberId: new DataLoader(
      async (subscriberIds: readonly string[]) => {
        const subscribers = await prisma.subscribersOnAuthors.findMany({
          where: { subscriberId: { in: subscriberIds as string[] } },
        });

        const map = new Map<string, (typeof subscribers)[0][]>();
        for (const id of subscriberIds) {
          map.set(id, []);
        }

        for (const subscriber of subscribers) {
          map.get(subscriber.subscriberId)!.push(subscriber);
        }

        return subscriberIds.map((id) => map.get(id) ?? []);
      },
    ),

    subscribersByAuthorId: new DataLoader(async (authorIds: readonly string[]) => {
      const subscribers = await prisma.subscribersOnAuthors.findMany({
        where: { authorId: { in: authorIds as string[] } },
      });

      const map = new Map<string, (typeof subscribers)[0][]>();

      for (const id of authorIds) {
        map.set(id, []);
      }

      for (const subscriber of subscribers) {
        map.get(subscriber.authorId)!.push(subscriber);
      }

      return authorIds.map((id) => map.get(id) ?? []);
    }),

    memberTypeById: new DataLoader(async (ids: readonly string[]) => {
      const uniqueIds = Array.from(new Set(ids));
      const memberTypes = await prisma.memberType.findMany({
        where: { id: { in: uniqueIds } },
      });
      const map = new Map(memberTypes.map((memberType) => [memberType.id, memberType]));
      return ids.map((id) => map.get(id) ?? null);
    }),
  };
}
