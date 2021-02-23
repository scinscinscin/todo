import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import { createClient, Provider } from "urql";
const client = createClient({
	url: "http://localhost:4000/graphql",
    fetchOptions: {credentials: "include"}
});

ReactDOM.render(
	<React.StrictMode>
		<Provider value={client}>
			<App />
		</Provider>
	</React.StrictMode>,
	document.getElementById("root")
);
