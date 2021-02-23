import { Request, Response } from "express";
import { Field, ObjectType } from "type-graphql";

@ObjectType()
export class FieldError {
	@Field()
	error: string;

	@Field()
	message: string;
}

export class ReqRes {
	req: Request;
	res: Response;
}
