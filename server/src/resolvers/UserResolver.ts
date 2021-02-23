import { User } from "../entity/User";
import {
	Arg,
	Ctx,
	Field,
	InputType,
	Mutation,
	ObjectType,
	Query,
	Resolver,
} from "type-graphql";
import jsonwebtoken from "jsonwebtoken";
import { v4 as uuidv4 } from "uuid";
import cryptorandomstring from "crypto-random-string";
import pbkdf2 from "pbkdf2";
import { FieldError, ReqRes } from "../types";
import { Stats } from "fs";

const { jwt_secret } = require("../../constants.json");
const checkUser = require("../utils/checkUser");

@InputType()
class RegisterLoginInput {
	@Field()
	username: string;

	@Field()
	password: string;
}

@ObjectType()
class UserResponse {
	@Field(() => [FieldError], { nullable: true })
	errors?: FieldError[];

	@Field(() => User, { nullable: true })
	user?: User;
}

@ObjectType()
class CheckLoginStatus {
	@Field(() => Boolean)
	ok: Boolean;

	@Field(() => User, { nullable: true })
	user?: User;
}

@Resolver()
export class UserResolver {
	@Query(() => CheckLoginStatus)
	async checkLoginStatus(@Ctx() { req }: ReqRes) {
		const status = checkUser(req);
		return status;
	}

	@Mutation(() => UserResponse)
	async register(
		@Arg("options", () => RegisterLoginInput) options: RegisterLoginInput,
		@Ctx() { req, res }: ReqRes
	): Promise<UserResponse> {
		const { username, password } = options;
		const uuid = uuidv4();
		const salt = await cryptorandomstring({
			length: 1024,
			type: "base64",
		});
		const hash = await pbkdf2
			.pbkdf2Sync(password, salt, 1, 1024, "sha512")
			.toString("hex");

		try {
			const user = await User.create({
				username,
				uuid,
				salt,
				hash,
			}).save();
			return { user };
		} catch {
			return {
				errors: [
					{
						error: "username is already taken",
						message: "pick a different username",
					},
				],
			};
		}
	}

	@Mutation(() => UserResponse)
	async login(
		@Arg("options", () => RegisterLoginInput) options: RegisterLoginInput,
		@Ctx() { req, res }: ReqRes
	) {
		const { username, password } = options;
		try {
			const user: User = await User.findOneOrFail({
				where: { username },
			});
			const { uuid, salt, hash } = user;

			if (
				pbkdf2
					.pbkdf2Sync(password, salt, 1, 1024, "sha512")
					.toString("hex") === hash
			) {
				// valid username
				let token = jsonwebtoken.sign({ uuid }, jwt_secret);
				res.cookie("jwt", token, {
					maxAge: 1000 * 60 * 60 * 24,
					httpOnly: true,
				});

				return { user };
			} else {
				return {
					errors: [
						{
							error: "incorrect credentials",
							message: "password is incorrect",
						},
					],
				};
			}
		} catch {
			return {
				errors: [
					{
						error: "incorrect credentials",
						message: "cannot find a user with that name",
					},
				],
			};
		}
	}

	@Mutation(() => Boolean)
	logout(@Ctx() { res }: ReqRes) {
		res.clearCookie("jwt");
		return true;
	}
}
