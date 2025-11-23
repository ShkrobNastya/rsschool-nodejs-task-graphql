import { FastifyPluginAsyncTypebox } from '@fastify/type-provider-typebox';
import { parse, validate, execute } from 'graphql';
import depthLimit from 'graphql-depth-limit';
import { PrismaClient } from '@prisma/client';
import { createGqlResponseSchema, gqlResponseSchema, createSchema } from './schemas.js';
import { createLoaders } from './dataloaders.js';

export interface GraphQLContext {
  prisma: PrismaClient;
  loaders: ReturnType<typeof createLoaders>;
}

const plugin: FastifyPluginAsyncTypebox = async (fastify) => {
  const { prisma } = fastify;

  const schema = createSchema(prisma);

  fastify.route({
    url: '/',
    method: 'POST',
    schema: {
      ...createGqlResponseSchema,
      response: {
        200: gqlResponseSchema,
      },
    },

    async handler(req) {
      const { query, variables } = req.body;

      const document = parse(query);

      const validationErrors = validate(schema, document, [depthLimit(5)]);

      if (validationErrors.length > 0) {
        return { errors: validationErrors };
      }

      const loaders = createLoaders(prisma);

      const result = await execute({
        schema,
        document,
        variableValues: variables,
        contextValue: { prisma, loaders },
      });

      return result;
    },
  });
};

export default plugin;
