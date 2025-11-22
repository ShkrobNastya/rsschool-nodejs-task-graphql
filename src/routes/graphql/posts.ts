import {
  GraphQLObjectType,
  GraphQLString,
  GraphQLNonNull,
  GraphQLList,
} from 'graphql';
import { UUIDType } from './types/uuid.js';


export const PostType = new GraphQLObjectType({
  name: 'Post',
  fields: () => ({
    id: { type: new GraphQLNonNull(UUIDType) },
    title: { type: new GraphQLNonNull(GraphQLString) },
    content: { type: new GraphQLNonNull(GraphQLString) }, 
  }),
});

export const postsQuery = (prisma) => ({
  type: new GraphQLList(new GraphQLNonNull(PostType)),

  resolve: async () => {
    return prisma.post.findMany();
  },
});

export const postQuery = (prisma) => ({
  type: PostType,
  args: {
    id: { type: new GraphQLNonNull(UUIDType) },
  },
  resolve: async (_root, args) => {    
    return await prisma.post.findUnique({
      where: { id: args.id },
    });
  },
});
