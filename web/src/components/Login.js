import { Formik, Field, Form } from "formik";
import { useMutation } from "urql";
import { useState } from "react";

const loginMutation = `
mutation ($username: String!, $password: String!){
    login(options: {username: $username, password: $password}){
        errors{
            error
            message
        }
        user{
            username
            uuid
        }
    }
}`;

const registerMutation = `
mutation ($username: String!, $password: String!){
    register(options: {username: $username, password: $password}){
        errors{
            error
            message
        }
        user{
            username
            uuid
        }
    }
}`;

const Login = () => {
	const [message, updateMessage] = useState("");
	const [registerResponse, register] = useMutation(registerMutation);
	const [loginResponse, login] = useMutation(loginMutation);
	return (
		<div>
			<Formik
				initialValues={{
					username: "",
					password: "",
					picked: "login",
				}}
				onSubmit={async (values, { resetForm }) => {
					console.log(values);
					const variables = {
						username: values.username,
						password: values.password,
					};
					if (values.picked === "create") {
						let response = await register(variables);
						console.log(response);
						if (response.data.register.errors) {
							updateMessage(
								"that username has already been taken"
							);
						} else {
							updateMessage("created user");
							resetForm();
						}
					} else {
						let response = await login(variables);
						if (response.data.login.errors) {
							updateMessage("incorrect credentials");
						} else {
							updateMessage("loggedin");
							window.location.href = "/";
						}
					}
				}}
			>
				<Form>
					<label htmlFor="username">Username</label>
					<Field
						required
						id="username"
						name="username"
						placeholder="username"
					/>

					<label htmlFor="password">Password</label>
					<Field
						required
						id="password"
						name="password"
						placeholder="password"
						type="password"
					/>

					<label>
						<Field
							type="radio"
							name="picked"
							value="login"
							required
						/>
						login
					</label>

					<label>
						<Field
							type="radio"
							name="picked"
							value="create"
							required
						/>
						create an account
					</label>
					<button type="submit">Submit</button>
				</Form>
			</Formik>
			<h1>{message}</h1>
		</div>
	);
};

export default Login;
