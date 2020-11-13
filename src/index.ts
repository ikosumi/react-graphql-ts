import {MikroORM} from '@mikro-orm/core';
import mikroConfig from "./mikro-orm.config";
import express from "express"

const main = async () => {
    const orm = await MikroORM.init(mikroConfig);
    await orm.getMigrator().up();

    const app = express();
    app.listen(4000, () => {
        console.log('server started on port 4000');
    });

    app.get('/', (_, resp) => {
        resp.send('hello, world');
    })
}

main().catch(err => {
    console.log(err)
});
