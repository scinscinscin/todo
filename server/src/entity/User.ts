import { Field, ObjectType } from "type-graphql";
import { Entity, PrimaryGeneratedColumn, Column, BaseEntity } from "typeorm";

@ObjectType()
@Entity()
export class User extends BaseEntity {
	@PrimaryGeneratedColumn()
	id: number;

	@Field()
	@Column({ unique: true })
	username: string;

	@Field()
	@Column({ unique: true })
	uuid: string;

	@Column()
	salt: string;

	@Column()
	hash: string;
}
