import alfy from 'alfy'
import { Gitlab } from '@gitbeaker/node'

const { token, host } = process.env

const api = new Gitlab({
  token,
  host
})

const mergeRequests = await api.Issues.all({
	scope: process.env.scope || 'assigned_to_me',
	view: 'simple',
	state: 'opened',
	projectId: process.env.id
})

const items = alfy
  .inputMatches(mergeRequests, 'title')
  .map(element => ({
    uid: element.id,
    title: element.title,
    subtitle: element.web_url,
    arg: element.web_url,
    quicklookurl: element.web_url,
    action: {
      url: element.web_url
    },
    variables: {
      id: element.id,
      name: element.title,
      repo: element.web_url
    }
  }))
alfy.output(items)
