import {Entity, PrimaryKey, Property} from "@mikro-orm/core";
import {Field, Int, ObjectType} from "type-graphql";

@Entity()
@ObjectType()
export class User {
    @Field(() => Int)
    @PrimaryKey()
    id!: number;

    @Field(() => String)
    @Property({type: 'date'})
    createdAt: Date = new Date();

    @Field(() => String)
    @Property({type: 'date'})
    updatedAt: Date = new Date();

    @Field(() => String)
    @Property({type: 'text', unique: true})
    username!: string;

    @Property({type: 'text'})
    password: string;
}
