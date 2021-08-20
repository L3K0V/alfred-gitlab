import alfy from 'alfy';
import { Gitlab } from '@gitbeaker/node';

const {token, host} = process.env

const api = new Gitlab({
	token,
	host
});

if (alfy.cache.isExpired("groups") || !alfy.cache.has("groups")) {
	alfy.output([{
		title: `Updating indices`,
		rerun: 5
	}])
	let groups = await api.Groups.all(); // eslint-disable-line
	alfy.cache.set("groups", groups, { maxAge: 604800000 });
}

if (alfy.cache.has("groups")) {
	const groups = alfy.cache.get("groups");
	let items = alfy
	.inputMatches(groups, 'name')
		.map(element => ({
		uid: element.id,
		title: element.name,
		subtitle: element.description,
		arg: element.web_url,
		quicklookurl: element.web_url,
		action: {
			url: element.web_url
		},
		variables: {
			id: element.id,
			name: element.name,
			url: element.web_url,
		},
		}));
	alfy.output(items);
}
	




