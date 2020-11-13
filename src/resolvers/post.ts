import {Arg, Ctx, Int, Mutation, Query, Resolver} from "type-graphql";
import {Post} from "../entities/Post";
import {MyContext} from "../Types";

@Resolver()
export class PostResolver {
    @Query(() => [Post])
    posts(@Ctx() {em}: MyContext): Promise<Post[]> {
        return em.find(Post, {});
    }

    @Query(() => Post, {nullable: true})
    post(@Arg('id', () => Int) id: number,
         @Ctx() {em}: MyContext): Promise<Post | null> {
        return em.findOne(Post, {id})
    }

    @Mutation(() => Post)
    async createPost(@Arg('title', () => String) title: String,
                     @Ctx() {em}: MyContext): Promise<Post> {
        const post = em.create(Post, {title});
        await em.persistAndFlush(post);
        return post;
    }

    @Mutation(() => Post)
    async updatePost(@Arg('id', () => Int) id: number,
                     @Arg('title', () => String) title: string,
                     @Ctx() {em}: MyContext): Promise<Post> {
        const post = await em.findOne(Post, {id});
        if (!post)
            throw Error('No post found');
        if (title !== 'undefined') {
            post.title = title
            await em.persistAndFlush(post);
        }
        return post;
    }
}
