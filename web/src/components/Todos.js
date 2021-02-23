import { Field, Form, Formik } from "formik";
import { useMutation, useQuery } from "urql";
import Todo from "./Todo";

const logoutMutation = `
    mutation{
        logout
    }
`;

const todosDataQuery = `
    query{
        listMyTodos{
            id
            title
            contents
            finished
        }
    }
`;

const createTodoMutation = `
    mutation($title: String!, $contents: String!){
        createTodo(options: {title: $title, contents: $contents}){
            errors{
                error
                message
            }
        }
    }
`;
const Todos = (props) => {
	const [logoutResponse, logout] = useMutation(logoutMutation);
	const [createTodoResponse, createTodo] = useMutation(createTodoMutation);

	const [todosData, refreshTodos] = useQuery({ query: todosDataQuery });
	const { fetching, error } = todosData;
	if (fetching) return <p>Loading todo list...</p>;
	if (error) return <p>Unable to fetch todos</p>;

	const todosList = todosData.data.listMyTodos;
	return (
		<div>
			<p>Hello {props.user}</p>
			{/* User and logout*/}
			<button
				onClick={async () => {
					await logout();
					window.location.href = "/";
				}}
			>
				Logout
			</button>

			{/* Add todos*/}

			<Formik
				initialValues={{
					title: "",
					contents: "",
				}}
				onSubmit={async (values) => {
					await createTodo(values);
					window.location.href = "/";
				}}
			>
				<Form>
					<label htmlFor="title">Title</label>
					<Field
						required
						id="title"
						name="title"
						placeholder="title"
					/>
					<label htmlFor="contents">Contents</label>
					<Field
						required
						id="contents"
						name="contents"
						placeholder="contents"
					/>
					<button type="submit">create todo</button>
				</Form>
			</Formik>

			{/* List out the todos*/}
			{todosList.map((todo) => {
				return <Todo props={todo} />;
			})}
		</div>
	);
};

export default Todos;
