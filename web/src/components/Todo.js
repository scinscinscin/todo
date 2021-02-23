import { useState } from "react";
import { useMutation } from "urql";

const updateTodoMutation = `
mutation ($id: Int!){
    updateTodo(id: $id){
        errors{
            error
            message
        }
        newValue
    }
}
`;

const Todo = (props) => {
	let { id, title, contents } = props.props;
	const [finished, updateFinish] = useState(props.props.finished);
	const [updateTodoResponse, updateTodo] = useMutation(updateTodoMutation);
	return (
		<div>
			<h1 className={finished ? "strikethrough" : ""}> {title}</h1>
			<p className={finished ? "strikethrough" : ""}> {contents}</p>
			<button
				onClick={async () => {
					let response = await updateTodo({
						id,
						finished: !finished,
					});
					updateFinish(response.data.updateTodo.newValue);
				}}
			>
				Toggle
			</button>
		</div>
	);
};

export default Todo;
