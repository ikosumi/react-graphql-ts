import {Post} from "./entities/Post";
import {MikroORM} from "@mikro-orm/core";
import path from 'path';

export default {
    migrations: {
      path: path.join(__dirname, "./migrations"),
      pattern: /^[\w-]+\d.[tj]s$/,
    },
    entities: [Post],
    type: "postgresql",
    dbName: "lireddit",
    debug: process.env.NODE_ENV !== 'production',
} as Parameters<typeof MikroORM.init>[0]
