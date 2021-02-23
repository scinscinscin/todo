import { Request } from "express";
import jsonwebtoken from "jsonwebtoken";
import { User } from "../entity/User";
const { jwt_secret } = require("../../constants.json");

async function checkUser(req: Request): Promise<any> {
	try {
		const { uuid }: any = jsonwebtoken.verify(req.cookies.jwt, jwt_secret);
		const user: User = await User.findOneOrFail({ where: { uuid } });
		return { ok: true, user };
	} catch {
		return { ok: false };
	}
}

module.exports = checkUser;
