import alfy from 'alfy';
import { Gitlab } from '@gitbeaker/node';

const {token, host} = process.env

const api = new Gitlab({
	token,
	host
});

const menu = [{
			uid: "repo",
			title: "Repository lookup",
			subtitle: "Browse Gitlab repositores you have access",
			variables: {
				selection: "repo"
			}
		},
		{
			uid: "group",
			title: "Group lookup",
			subtitle: "Show GitLab groups you have access",
			variables: {
				selection: "group"
			},
		},
		{
			uid: "issues",
			title: "Issues assigned to you",
			subtitle: "Browse issues assigned to you",
			variables: {
				selection: "issues"
			},
		},
		{
			uid: "merge_requests",
			title: "Merge requests assigned to you",
			subtitle: "Browse all merge requests assigned to you",
			variables: {
				selection: "merge_requests"
			},
		},
		{
			uid: "reviews",
			title: "Review requests for you",
			subtitle: "Merge requests",
			variables: {
				selection: "reviews"
			},
		},
		{
			uid: "todos",
			title: "Todos",
			subtitle: "Check all todos for you",
			variables: {
				selection: "todos"
			},
		}
]

if (alfy.cache.isExpired("projects") || !alfy.cache.has("projects")) {
	alfy.output([{
		title: `Updating indices`,
		rerun: 5
	}])
	let projects = await api.Projects.all(); // eslint-disable-line
	alfy.cache.set("projects", projects, { maxAge: 604800000 });
}

if (!alfy.input || alfy.input === "") {
	alfy.output(menu);
} else {
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
}


