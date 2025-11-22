import {
  GraphQLNonNull,
  GraphQLString,
} from 'graphql';
import { UUIDType } from './types/uuid.js';
import { ProfileType } from './profiles.js';
import { PostType } from './posts.js';
import { UserType } from './users.js';
import {CreateUserInput, CreateProfileInput, CreatePostInput, 
    ChangeUserInput, ChangeProfileInput, ChangePostInput  } from './mutations-inputs.js';

export const createUser = (prisma) => ({
  type: new GraphQLNonNull(UserType),
  args: { dto: { type: new GraphQLNonNull(CreateUserInput) } },
  resolve: (_, { dto }) => prisma.user.create({ data: dto }),
});

export const createProfile = (prisma) => ({
  type: new GraphQLNonNull(ProfileType),
  args: { dto: { type: new GraphQLNonNull(CreateProfileInput) } },
  resolve: (_, { dto }) => prisma.profile.create({ data: dto }),
});

export const createPost = (prisma) => ({
  type: new GraphQLNonNull(PostType),
  args: { dto: { type: new GraphQLNonNull(CreatePostInput) } },
  resolve: (_, { dto }) => prisma.post.create({ data: dto }),
});

export const changeUser = (prisma) => ({
  type: new GraphQLNonNull(UserType),
  args: {
    id: { type: new GraphQLNonNull(UUIDType) },
    dto: { type: new GraphQLNonNull(ChangeUserInput) },
  },
  resolve: (_, { id, dto }) =>
    prisma.user.update({ where: { id }, data: dto }),
});

export const changeProfile = (prisma) => ({
  type: new GraphQLNonNull(ProfileType),
  args: {
    id: { type: new GraphQLNonNull(UUIDType) },
    dto: { type: new GraphQLNonNull(ChangeProfileInput) },
  },
  resolve: (_, { id, dto }) =>
    prisma.profile.update({ where: { id }, data: dto }),
});

export const changePost = (prisma) => ({
  type: new GraphQLNonNull(PostType),
  args: {
    id: { type: new GraphQLNonNull(UUIDType) },
    dto: { type: new GraphQLNonNull(ChangePostInput) },
  },
  resolve: (_, { id, dto }) =>
    prisma.post.update({ where: { id }, data: dto }),
});

export const deleteUser = (prisma) => ({
  type: new GraphQLNonNull(GraphQLString),
  args: { id: { type: new GraphQLNonNull(UUIDType) } },
  resolve: async (_, { id }) => {
    await prisma.user.delete({ where: { id } });
    return "User deleted";
  },
});

export const deletePost = (prisma) => ({
  type: new GraphQLNonNull(GraphQLString),
  args: { id: { type: new GraphQLNonNull(UUIDType) } },
  resolve: async (_, { id }) => {
    await prisma.post.delete({ where: { id } });
    return "Post deleted";
  },
});

export const deleteProfile = (prisma) => ({
  type: new GraphQLNonNull(GraphQLString),
  args: { id: { type: new GraphQLNonNull(UUIDType) } },
  resolve: async (_, { id }) => {
    await prisma.profile.delete({ where: { id } });
    return "Profile deleted";
  },
});

export const subscribeTo = (prisma) => ({
  type: new GraphQLNonNull(GraphQLString),
  args: {
    userId: { type: new GraphQLNonNull(UUIDType) },
    authorId: { type: new GraphQLNonNull(UUIDType) },
  },
  resolve: async (_, { userId, authorId }) => {
    await prisma.subscribersOnAuthors.create({
      data: { subscriberId: userId, authorId },
    });
    return "Subscribed";
  },
});

export const unsubscribeFrom = (prisma) => ({
  type: new GraphQLNonNull(GraphQLString),
  args: {
    userId: { type: new GraphQLNonNull(UUIDType) },
    authorId: { type: new GraphQLNonNull(UUIDType) },
  },
  resolve: async (_, { userId, authorId }) => {
    await prisma.subscribersOnAuthors.delete({
      where: { subscriberId_authorId: { subscriberId: userId, authorId } },
    });
    return "Unsubscribed";
  },
});
