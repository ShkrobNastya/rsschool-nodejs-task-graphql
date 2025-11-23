import {
  GraphQLNonNull,
  GraphQLString,
} from 'graphql';
import { PrismaClient } from '@prisma/client';
import { UUIDType } from '../types/uuid.js';
import { PostType } from '../types/posts.js';
import { CreatePostInput, ChangePostInput  } from '../inputs/posts.js';

export const createPost = (prisma: PrismaClient) => ({
  type: new GraphQLNonNull(PostType),
  args: { dto: { type: new GraphQLNonNull(CreatePostInput) } },
  resolve: (_, { dto }) => prisma.post.create({ data: dto }),
});

export const changePost = (prisma: PrismaClient) => ({
  type: new GraphQLNonNull(PostType),
  args: {
    id: { type: new GraphQLNonNull(UUIDType) },
    dto: { type: new GraphQLNonNull(ChangePostInput) },
  },
  resolve: (_, { id, dto }) =>
    prisma.post.update({ where: { id }, data: dto }),
});

export const deletePost = (prisma: PrismaClient) => ({
  type: new GraphQLNonNull(GraphQLString),
  args: { id: { type: new GraphQLNonNull(UUIDType) } },
  resolve: async (_, { id }) => {
    await prisma.post.delete({ where: { id } });
    return "Post deleted";
  },
});
