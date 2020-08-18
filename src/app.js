const express = require("express");
const cors = require("cors");
const { uuid, isUuid } = require('uuidv4');


const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];

function validateRepoId(request, response, next) {
  const { id } = request.params

  if(!isUuid(id)) {
    return response.status(400).json({ error: 'Invalid repository ID' })
  }

  return next()
}

//app.use('/repositories/:id', validateRepoId)

app.get("/repositories", (request, response) => {
  return response.json(repositories)
});

app.post("/repositories", (request, response) => {
  const { title, url, techs } = request.body

  const newRepository = {
    id: uuid(),
    title,
    url,
    techs,
    likes: 0,
  }

  repositories.push(newRepository)

  return response.status(201).json(newRepository)
});

app.put("/repositories/:id", validateRepoId, (request, response) => {
  const { title, url, techs } = request.body
  const { id } = request.params

  const repoIndex = repositories.findIndex(repo => repo.id === id)

  if(repoIndex < 0) {
    return response.status(400).json({ error: 'Repository not found' })
  }

  repositories[repoIndex] = {
    id,
    title: title ? title : repositories[repoIndex].title,
    url: url ? url : repositories[repoIndex].url,
    techs: techs ? techs : repositories[repoIndex].techs,
    likes: repositories[repoIndex].likes
  }

  return response.json(repositories[repoIndex])
});

app.delete("/repositories/:id", validateRepoId, (request, response) => {
  const { id } = request.params

  const repoIndex = repositories.findIndex(repo => repo.id === id)

  if(repoIndex < 0) {
    return response.status(400).json({ error: 'Repository not found' })
  }

  repositories.splice(repoIndex, 1)

  return response.status(204).send()
});

app.post("/repositories/:id/like", validateRepoId, (request, response) => {
  const { id } = request.params

  const repoIndex = repositories.findIndex(repo => repo.id === id)

  if(repoIndex < 0) {
    return response.status(400).json({ error: 'Repository not found' })
  }

  repositories[repoIndex].likes += 1
  
  return response.json(repositories[repoIndex])
});

module.exports = app;
