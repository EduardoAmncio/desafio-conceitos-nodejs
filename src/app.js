const express = require("express");
const cors = require("cors");

 const { v4: uuid, validate: isUuid, v4, validate } = require('uuid');

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];

function validadeUuid(request, response, next) {
  const {id} = request.params;

  if (!validate(id)) {
    return response.status(400).send("Invalid id informed!");
  }

  return next();
}

app.get("/repositories", (request, response) => {
  return response.json(repositories);
});

app.post("/repositories", (request, response) => {
  const {title, url, techs} = request.body;
  const new_project = {
    id : v4(),
    title : title,
    url : url,
    techs : techs,
    likes : 0
  };

  repositories.push(new_project);

  return response.json(new_project);
});

app.put("/repositories/:id", validadeUuid, (request, response) => {

  const {id} = request.params;
  const {title, url, techs} = request.body;

  var indexRepo = repositories.findIndex(repo => repo.id === id);
  if (indexRepo === -1) {
    return response.status(400).json({error : "The repository doesnt exist"});
  }

  const repository = {
    id : repositories[indexRepo].id,
    likes : repositories[indexRepo].likes,
    title : title, 
    url : url, 
    techs : techs,
  };

  repositories[indexRepo] = repository;

  return response.json(repositories[indexRepo]);

});

app.delete("/repositories/:id", (request, response) => {
  const {id} = request.params;

  var indexRepo = repositories.findIndex(repo => repo.id === id);
  
  if (indexRepo < 0) {
    return response.status(400).json({error : "The repository doesnt exist"});
  }

  repositories.splice(indexRepo, 1);

  return response.status(204).send();
});

app.post("/repositories/:id/like", (request, response) => {
  const {id} = request.params;

  var indexRepo = repositories.findIndex(repo => repo.id === id);

  if (indexRepo < 0) {
    return response.status(400).json({error : "The repository doesnt exist"});
  }

  repositories[indexRepo].likes = repositories[indexRepo].likes + 1;

  return response.send(repositories[indexRepo]);
});

module.exports = app;
