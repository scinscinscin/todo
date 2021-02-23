import { Field, Int, ObjectType } from "type-graphql";
import { Entity, PrimaryGeneratedColumn, Column, BaseEntity } from "typeorm";

@ObjectType()
@Entity()
export class Todo extends BaseEntity {
	@Field(() => Int)
	@PrimaryGeneratedColumn()
	id: number;

	@Column()
	author: string;

	@Field()
	@Column()
	title: string;

	@Field()
	@Column()
	contents: string;

	@Field()
	@Column({ nullable: true, default: false })
	finished: boolean;
}
