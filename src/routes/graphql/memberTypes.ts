import {
  GraphQLObjectType,
  GraphQLFloat,
  GraphQLInt,
  GraphQLEnumType,
  GraphQLList,
  GraphQLNonNull,
} from 'graphql';

export const MemberTypeIdEnum = new GraphQLEnumType({
  name: 'MemberTypeId',
  values: {
    BASIC: { value: 'BASIC' },
    BUSINESS: { value: 'BUSINESS' },
  },
});

export const MemberTypeType = new GraphQLObjectType({
  name: 'MemberType',
  fields: () => ({
    id: { type: new GraphQLNonNull(MemberTypeIdEnum) },
    discount: { type: new GraphQLNonNull(GraphQLFloat) },
    postsLimitPerMonth: { type: new GraphQLNonNull(GraphQLInt) },
  }),
});

export const memberTypesQuery = (prisma) => ({
  type: new GraphQLList(new GraphQLNonNull(MemberTypeType)),
  resolve: async () => {
    return prisma.memberType.findMany();
  },
});

export const memberTypeQuery = (prisma) => ({
  type: MemberTypeType,
  args: {
    id: { type: new GraphQLNonNull(MemberTypeIdEnum) },
  },
  resolve: async (_root, args) => {
    return await prisma.memberType.findUnique({
      where: { id: args.id },
    });
  },
});
