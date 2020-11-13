import {MikroORM} from '@mikro-orm/core';
import mikroConfig from "./mikro-orm.config";
import express from "express"
import {ApolloServer} from "apollo-server-express";
import {buildSchema} from "type-graphql";
import {HelloResolver} from "./resolvers/resolver";
import {PostResolver} from "./resolvers/post";
import {UserResolver} from "./resolvers/userResolver";

const main = async () => {
    const orm = await MikroORM.init(mikroConfig);
    await orm.getMigrator().up();

    const apolloServer = new ApolloServer({
        schema: await buildSchema({
            resolvers: [HelloResolver, PostResolver, UserResolver],
            validate: false,
        }),
        context: () => ({ em: orm.em })
    });

    const app = express();
    apolloServer.applyMiddleware({ app });
    app.listen(4000, () => {
        console.log('server started on port 4000');
    });

    app.get('/', (_, resp) => {
        resp.send('hello, world');
    });
}

main().catch(err => {
    console.log(err)
});
