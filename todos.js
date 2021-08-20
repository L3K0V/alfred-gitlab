import alfy from 'alfy';
import { Gitlab } from '@gitbeaker/node';

const {token, host} = process.env

const api = new Gitlab({
	token,
	host
});

const todos = await api.Todos.all();

if (todos.length === 0) {
	alfy.error("No pending todos")
} else {
	let items = alfy
	.inputMatches(todos, 'body')
		.map(element => ({
		uid: element.id,
		title: element.body,
		subtitle: element.name_with_namespace,
		arg: element.target_url,
		quicklookurl: element.target_url,
		action: {
			url: element.target_url
		},
		variables: {
			id: element.id,
			url: element.target_url,
		},
		}));
	alfy.output(items);
}


	




