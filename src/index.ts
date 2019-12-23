import { buildSchema } from "type-graphql";
import { DogResolver, PersonResolver } from "./resolver";
import { ApolloServer } from 'apollo-server';

async function bootstrap() {
  const schema = await buildSchema({
    resolvers: [DogResolver, PersonResolver],
  });

  const server = new ApolloServer({
    schema,
  });

  const mdStorage = (global as any).TypeGraphQLMetadataStorage;

  const qNameCount: { [key: string]: number } = {};
  mdStorage.queries.forEach((q: any) => {
    qNameCount[q.schemaName] === undefined ? qNameCount[q.schemaName] = 1 : qNameCount[q.schemaName]++
  });
  console.log('Query Count By Name', qNameCount);

  server.listen().then(serverInfo => {
    console.log(`Listening on ${serverInfo.port}!`);
  });
}

bootstrap();