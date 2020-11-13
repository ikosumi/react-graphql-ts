import {Post} from "./entities/Post";
import {MikroORM} from "@mikro-orm/core";
import path from 'path';
import {User} from "./entities/User";

export default {
    migrations: {
      path: path.join(__dirname, "./migrations"),
      pattern: /^[\w-]+\d.[tj]s$/,
    },
    entities: [Post, User],
    type: "postgresql",
    dbName: "lireddit",
    debug: process.env.NODE_ENV !== 'production',
} as Parameters<typeof MikroORM.init>[0]
