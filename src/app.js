const express = require("express");
const { v4: uuid } = require('uuid');
const cors = require("cors");

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];

app.get("/repositories", (request, response) => {
    return response.json(repositories);
});

app.post("/repositories", (request, response) => {
  const { title, url, techs } = request.body;

  const repository = { id: uuid(), title, url, techs, likes: 0 };
  repositories.push(repository);

  response.json(repository);
});

app.put("/repositories/:id", (request, response) => {
  const { id } = request.params;
  const { title, url, techs } = request.body;

  const repositoryIndex = repositories.findIndex(repository => repository.id == id);

  if(repositoryIndex < 0) {
      return response.status(400).json({ message: "Repository not found." });
  }

  const foundRepository = repositories[repositoryIndex];

  const repository = {
      id,
      title,
      url,
      techs,
      likes: foundRepository.likes
  }

  repositories[repositoryIndex] = repository;

  return response.json(repository);
});

app.delete("/repositories/:id", (request, response) => {
    const { id } = request.params;

    const repositoryIndex = repositories.findIndex(repository => repository.id == id);

    if(repositoryIndex < 0) {
        return response.status(400).json({ message: "Repository not found." });
    }

    repositories.splice(repositoryIndex, 1);

    return response.status(204).send();
});

app.post("/repositories/:id/like", (request, response) => {
    const { id } = request.params;

    const repositoryIndex = repositories.findIndex(repository => repository.id == id);

    if(repositoryIndex < 0) {
        return response.status(400).json({ message: "Repository not found." });
    }

    const repository = repositories[repositoryIndex];

    repository.likes++;

    repositories[repositoryIndex] = repository;

    return response.json(repository);
});

module.exports = app;
