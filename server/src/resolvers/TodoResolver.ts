import { Todo } from "../entity/Todo";
import { FieldError, ReqRes } from "../types";
import {
	Arg,
	Ctx,
	Field,
	InputType,
	Int,
	Mutation,
	ObjectType,
	Query,
	Resolver,
} from "type-graphql";

const checkUser = require("../utils/checkUser");

@InputType()
class TodoInput {
	@Field()
	title: string;

	@Field()
	contents: string;
}

@ObjectType()
class CreateTodoResponse {
	@Field(() => [FieldError], { nullable: true })
	errors?: FieldError[];

	@Field(() => Todo, { nullable: true })
	todo?: Todo;
}

@ObjectType()
class UpdateTodoResponse {
	@Field(() => [FieldError], { nullable: true })
	errors?: FieldError[];

	@Field(() => Boolean, { nullable: true })
	newValue?: Boolean;
}

@Resolver()
export class TodoResolver {
	@Query(() => [Todo])
	async listMyTodos(@Ctx() { req }: ReqRes): Promise<Todo[]> {
		const { ok, user } = await checkUser(req);
		if (!ok) {
			// this should never be reached since the front end only tries to display posts when the user is logged in
			return [];
		}
		return Todo.find({ where: { author: user.username } });
	}

	@Mutation(() => CreateTodoResponse)
	async createTodo(
		@Arg("options", () => TodoInput) options: TodoInput,
		@Ctx() { req }: ReqRes
	): Promise<CreateTodoResponse> {
		const { ok, user } = await checkUser(req);
		if (!ok) {
			return {
				errors: [
					{
						error: "not logged in",
						message: "you need to be logged in to create a post",
					},
				],
			};
		}
		const { username } = user;
		const { title, contents } = options;
		const todo: Todo = await Todo.create({
			author: username,
			title,
			contents,
		}).save();
		return { todo };
	}

	@Mutation(() => UpdateTodoResponse)
	async updateTodo(@Arg("id", () => Int) id: number, @Ctx() { req }: ReqRes) {
		const { ok, user } = await checkUser(req);
		if (!ok) {
			return {
				errors: [
					{
						error: "not logged in",
						message: "you need to be logged in to create a post",
					},
				],
			};
		}

		try {
			let todo: Todo = await Todo.findOneOrFail({
				where: { id, author: user.username },
			});
			await Todo.update(
				{ id, author: user.username },
				{ finished: !todo.finished }
			);
			return { newValue: !todo.finished };
		} catch {
			return {
				errors: [
					{
						error: "couldn't find todo with that id",
						message: "internal error has occured",
					},
				],
			};
		}
	}
}
