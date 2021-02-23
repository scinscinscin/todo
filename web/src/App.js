import Login from "./components/Login";
import Todos from "./components/Todos";
import "./App.css";

import { gql, useQuery } from "urql";

const loginStatusQuery = gql`
	query {
		checkLoginStatus {
			ok
			user {
				username
			}
		}
	}
`;

const App = () => {
	const [loginStatusData, checkLoginAgain] = useQuery({
		query: loginStatusQuery,
	});

	const { fetching, error } = loginStatusData;
	if (fetching) return <p>Loading...</p>;
	if (error) return <p>Unable to load api</p>;
	const loginStatus = loginStatusData.data.checkLoginStatus;

	if (loginStatus.ok) {
		return <Todos user={loginStatus.user.username} />;
	} else {
		return <Login />;
	}
};
export default App;
