import {Arg, Ctx, Field, InputType, Mutation, ObjectType, Resolver} from "type-graphql"
import {MyContext} from "../Types"
import {User} from "../entities/User"
import argon2 from "argon2"

@InputType()
class Credentials {
    @Field(() => String)
    username: string
    @Field(() => String)
    password: string
}

@ObjectType()
class FieldError {
    @Field()
    field: string
    @Field()
    message: string
}

@ObjectType()
class UserResponse {
    @Field(() => [FieldError], {nullable: true})
    errors?: FieldError[]
    @Field(() => User, {nullable: true})
    user?: User
}

@Resolver()
export class UserResolver {
    @Mutation(() => UserResponse)
    async register(
        @Arg('credentials') credentials: Credentials,
        @Ctx() {em}: MyContext
    ): Promise<UserResponse> {
        if (credentials.username.length <= 2) {
            return {
                errors: [
                    {
                        field: 'username',
                        message: 'username is too short (must be greater than 2)'
                    }
                ]
            }
        }
        if (credentials.password.length < 3) {
            return {
                errors: [
                    {
                        field: 'password',
                        message: 'password is too short (must be at least 4 chars)'
                    }
                ]
            }
        }
        const user = await em.create(
            User, {
                username: credentials.username,
                password: await argon2.hash(credentials.password)
            });
        try {
            await em.persistAndFlush(user)
        } catch (err) {
            console.log(err)
            if (err.code === '23505') {
                return {
                    errors: [
                        {
                            field: 'username',
                            message: 'username already taken'
                        }
                    ]
                }
            }
        }
        return {user}
    }

    @Mutation(() => UserResponse)
    async login(
        @Arg('credentials') credentials: Credentials,
        @Ctx() {em}: MyContext
    ): Promise<UserResponse> {
        const user = await em.findOne(User, {username: credentials.username})
        if (!user) {
            return {
                errors: [
                    {
                        field: 'username',
                        message: 'nonexistent username'
                    }
                ]
            }
        }
        const isCorrectPassword = await argon2.verify(user.password, credentials.password)
        if (!isCorrectPassword) {
            return {
                errors: [
                    {
                        field: 'password',
                        message: 'incorrect password'
                    }
                ]
            }
        }
        return {user}
    }

}
