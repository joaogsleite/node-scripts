const fetch = require('node-fetch')
require('dotenv').config()

const GITHUB_TOKEN = process.env.GITHUB_TOKEN
const BASE_URL = 'https://api.github.com'

function request(method, url, body) {
  return fetch(`${BASE_URL}${url}`, {
    method,
    headers: {
      'Authorization': `token ${GITHUB_TOKEN}`
    },
    body: body && JSON.stringify(body) 
  }).then((res) => {
    return res.text()
  }).then((text) => {
    try {
      return JSON.parse(text)
    } catch {
      return text
    }
  })
}

async function deleteLabelsFromRepo(repo) {
  const labels = await request('GET', `/repos/${repo}/labels`) 
  await Promise.all(
    labels.map((label) => {
      const name = label.name
      return request('DELETE', `/repos/${repo}/labels/${name}`)
    })
  )
}

async function copyLabelsBetweenRepos(from, to) {
  const labels = await request('GET', `/repos/${from}/labels`) 
  await Promise.all(
    labels.map((label) => {
      const body = {
        name: label.name,
        color: label.color,
        description: label.description,
      }
      return request('POST', `/repos/${to}/labels`, body)
    })
  )
}

//deleteLabelsFromRepo('org/repo')
//copyLabelsBetweenRepos('org/repo1', 'org/repo2')