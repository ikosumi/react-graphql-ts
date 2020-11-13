import {Arg, Ctx, Field, InputType, Mutation, Resolver} from "type-graphql";
import {MyContext} from "../Types";
import {User} from "../entities/User";
import argon2 from "argon2";

@InputType()
class Credentials {
    @Field(() => String)
    username: string;
    @Field(() => String)
    password: string;
}

@Resolver()
export class UserResolver {
    @Mutation(() => User)
    async register(@Arg('credentials') credentials: Credentials,
                   @Ctx() {em}: MyContext): Promise<User> {
        const user = await em.create(
            User, {
                username: credentials.username,
                password: await argon2.hash(credentials.password)
            });
        await em.persistAndFlush(user);
        return user;
    }
}
