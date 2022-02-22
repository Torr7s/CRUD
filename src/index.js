const express = require('express');
const { v4: uuid } = require('uuid');

const app = express()

app.use(express.json())

const repositories = []

function checkRepositoryExists(_request, _response, _next) {
  const { id } = _request.params

  const repositoryIndex = repositories.findIndex((repository) => repository.id === id)

  if (repositoryIndex === -1) {
    return _response
      .status(404)
      .json({
        error: 'Repository does not exists!'
      })
  }

  _request.repo = repositoryIndex

  return _next()
}

app.get('/repositories', (_request, _response) => {
  return _response.json(repositories)
})

app.post('/repositories', (_request, _response) => {
  const { title, url, techs } = _request.body

  const repository = {
    id: uuid(),
    title,
    url,
    techs,
    likes: 0
  }

  repositories.push(repository)

  return _response.status(201).json(repository)
})

app.put('/repositories/:id', checkRepositoryExists, (_request, _response) => {
  const { repo } = _request
  const repositoryData = _request.body

  for (const property in repositoryData) {
    if (property === 'likes') {
      repositoryData['likes'] = 0
    }
  }

  const repository = {
    ...repositories[repo],
    ...repositoryData
  }

  repositories[repo] = repository

  return _response.json(repository)
})

app.delete('/repositories/:id', checkRepositoryExists, (_request, _response) => {
  const { repo } = _request

  repositories.splice(repo, 1)

  return _response.status(204).send()
})

app.post('/repositories/:id/like', checkRepositoryExists, (_request, _response) => {
  const { repo } = _request

  const likes = ++repositories[repo].likes

  return _response.json({ likes })
})

module.exports = app
