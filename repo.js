import alfy from 'alfy';
import { Gitlab } from '@gitbeaker/node';

const {token, host} = process.env

const api = new Gitlab({
	token,
	host
});

if (alfy.cache.isExpired("projects") || !alfy.cache.has("projects")) {
	alfy.output([{
		title: `Updating indices`,
		rerun: 5
	}])
	let res = await api.Projects.all();
	alfy.cache.set("projects", res, {maxAge: 604800000 })
}


if (alfy.cache.has("projects")) {
	const projects = alfy.cache.get("projects");
	let items = alfy
	.inputMatches(projects, 'name_with_namespace')
		.map(element => ({
		uid: element.id,
		title: element.name,
		subtitle: element.name_with_namespace,
		arg: element.web_url,
		quicklookurl: element.web_url,
		action: {
			url: element.web_url
		},
		variables: {
			id: element.id,
			name: element.name,
			full_name: element.name_with_namespace,
			repo: element.web_url,
			default_branch: element.default_branch
		},
		}));
	alfy.output(items);
}




